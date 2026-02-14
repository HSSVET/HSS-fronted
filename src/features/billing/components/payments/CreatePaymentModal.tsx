import React, { useState, useEffect } from 'react';
import { useBilling } from '../../hooks/useBilling';
import { POSTerminal, CardInfo } from '../../types';
import { billingService } from '../../services/billingService';

export interface OwnerInvoiceOption {
  id?: number;
  invoiceId?: number;
  invoiceNumber: string;
  totalAmount?: number;
  amount?: number;
  status?: string;
}

interface CreatePaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
  invoiceId?: number;
  /** When provided (e.g. from owner detail page), only these invoices are shown in the dropdown */
  ownerInvoices?: OwnerInvoiceOption[];
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({ 
  onClose, 
  onSuccess, 
  invoiceId,
  ownerInvoices 
}) => {
  const { invoices, createPayment } = useBilling();
  const [loading, setLoading] = useState(false);
  const [posTerminals, setPosTerminals] = useState<POSTerminal[]>([]);
  const [processingCard, setProcessingCard] = useState(false);
  
  const invoiceList = ownerInvoices?.length ? ownerInvoices : invoices;
  const getInvoiceId = (inv: { id?: number; invoiceId?: number }) => inv.id ?? inv.invoiceId ?? 0;
  const getInvoiceAmount = (inv: { total?: number; totalAmount?: number; amount?: number }) => Number(inv.total ?? inv.totalAmount ?? inv.amount ?? 0);
  const unpaidInvoices = ownerInvoices
    ? ownerInvoices.filter(inv => (inv.status ?? '').toUpperCase() !== 'PAID')
    : invoices.filter(inv => inv.status !== 'paid');
  
  // Form state
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number>(invoiceId || 0);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check'>('cash');
  const [description, setDescription] = useState('');
  
  // Nakit ödeme için
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [changeGiven, setChangeGiven] = useState<number>(0);
  
  // Kart ödeme için
  const [selectedPosTerminal, setSelectedPosTerminal] = useState<string>('');
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | 'troy'>('visa');
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  
  // Havale için
  const [bankAccount, setBankAccount] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  
  // Çek için
  const [checkNumber, setCheckNumber] = useState('');
  const [checkBank, setCheckBank] = useState('');
  const [checkDate, setCheckDate] = useState('');

  useEffect(() => {
    const loadPosTerminals = async () => {
      try {
        const response = await billingService.getPOSTerminals();
        setPosTerminals(response.data);
        if (response.data.length > 0) {
          setSelectedPosTerminal(response.data[0].id);
        }
      } catch (error) {
        console.error('POS terminalleri yüklenemedi:', error);
      }
    };
    
    loadPosTerminals();
  }, []);

  useEffect(() => {
    if (selectedInvoiceId && invoiceList.length) {
      const invoice = ownerInvoices
        ? ownerInvoices.find(inv => getInvoiceId(inv) === selectedInvoiceId)
        : invoices.find(inv => inv.id === selectedInvoiceId);
      if (invoice) {
        setAmount(ownerInvoices ? getInvoiceAmount(invoice) : (invoice as { total?: number }).total ?? 0);
      }
    }
  }, [selectedInvoiceId, invoiceList, ownerInvoices, invoices]);

  useEffect(() => {
    // Nakit ödeme için para üstü hesaplama
    if (paymentMethod === 'cash' && cashReceived > 0 && amount > 0) {
      const change = cashReceived - amount;
      setChangeGiven(change > 0 ? change : 0);
    }
  }, [cashReceived, amount, paymentMethod]);

  const handleCardPayment = async () => {
    if (!selectedPosTerminal || amount <= 0) return null;
    
    setProcessingCard(true);
    try {
      const response = await billingService.processCardPayment(
        amount, 
        selectedPosTerminal, 
        cardType
      );
      
      if (response.data.success) {
        return {
          authorizationCode: response.data.authorizationCode,
          batchNumber: response.data.batchNumber
        };
      } else {
        alert(`POS İşlem Hatası: ${response.data.errorMessage}`);
        return null;
      }
    } catch (error) {
      alert('POS bağlantı hatası');
      return null;
    } finally {
      setProcessingCard(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInvoiceId || amount <= 0) {
      alert('Lütfen fatura ve tutar seçin');
      return;
    }

    if (paymentMethod === 'cash' && cashReceived < amount) {
      alert('Alınan nakit tutar, ödeme tutarından az olamaz');
      return;
    }

    setLoading(true);
    
    try {
      let paymentData: any = {
        invoiceId: selectedInvoiceId,
        amount,
        paymentDate: new Date(),
        paymentMethod,
        description,
        status: 'completed',
        createdBy: 'Kullanıcı' // Gerçek uygulamada session'dan gelecek
      };

      // Ödeme yöntemine göre özel alanlar
      switch (paymentMethod) {
        case 'cash':
          paymentData.cashReceived = cashReceived;
          paymentData.changeGiven = changeGiven;
          break;
          
        case 'credit_card':
        case 'debit_card':
          // POS işlemi simülasyonu
          const cardResult = await handleCardPayment();
          if (!cardResult) {
            setLoading(false);
            return;
          }
          
          const terminal = posTerminals.find(t => t.id === selectedPosTerminal);
          paymentData.posTerminal = terminal;
          paymentData.cardInfo = {
            cardType,
            lastFourDigits,
            bankName: terminal?.bank || '',
            cardHolderName
          };
          paymentData.authorizationCode = cardResult.authorizationCode;
          paymentData.batchNumber = cardResult.batchNumber;
          break;
          
        case 'bank_transfer':
          paymentData.bankAccount = bankAccount;
          paymentData.referenceNumber = referenceNumber;
          break;
          
        case 'check':
          paymentData.checkNumber = checkNumber;
          paymentData.checkBank = checkBank;
          paymentData.checkDate = checkDate ? new Date(checkDate) : new Date();
          break;
      }

      await createPayment(paymentData);
      onSuccess();
    } catch (error) {
      alert('Ödeme kaydedilemedi: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const selectedInvoice = ownerInvoices
    ? ownerInvoices.find(inv => getInvoiceId(inv) === selectedInvoiceId)
    : invoices.find(inv => inv.id === selectedInvoiceId);

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Ödeme Kaydet</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <p className="form-label" style={{ padding: '0 1rem', margin: '0 0 1rem', fontSize: '0.9rem', color: 'var(--text-secondary, #666)' }}>
          Ödeme, aşağıda seçtiğiniz faturaya işlenir.
        </p>

        <form onSubmit={handleSubmit} className="billing-form">
          {/* Fatura Seçimi */}
          <div className="form-group">
            <label className="form-label">Fatura</label>
            {ownerInvoices && unpaidInvoices.length === 0 ? (
              <div role="alert" style={{ padding: '1rem', background: '#fff3cd', borderRadius: 'var(--border-radius-sm)', marginBottom: '1rem', border: '1px solid #ffc107' }}>
                Bu müşteri için fatura bulunmuyor. Önce fatura oluşturun (Faturalar sayfasından veya ilgili işlemden).
              </div>
            ) : (
              <select
                className="form-select"
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(Number(e.target.value))}
                required
              >
                <option value="">Fatura Seçin</option>
                {ownerInvoices
                  ? unpaidInvoices.map(inv => (
                      <option key={getInvoiceId(inv)} value={getInvoiceId(inv)}>
                        {inv.invoiceNumber} - {(getInvoiceAmount(inv)).toFixed(2)} TL
                      </option>
                    ))
                  : invoices.filter(inv => inv.status !== 'paid').map(invoice => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber} - {invoice.patient?.name ?? '-'} - {invoice.total.toFixed(2)} TL
                      </option>
                    ))}
              </select>
            )}
          </div>

          {selectedInvoice && (
            <div style={{ 
              padding: 'var(--spacing-1)', 
              background: 'var(--surface-variant)', 
              borderRadius: 'var(--border-radius-sm)',
              marginBottom: 'var(--spacing-2)'
            }}>
              <strong>Seçilen Fatura:</strong> {(selectedInvoice as { invoiceNumber?: string }).invoiceNumber ?? ''}<br/>
              {!ownerInvoices && (selectedInvoice as { patient?: { name?: string; ownerName?: string } }).patient && (
                <>
                  <strong>Hasta:</strong> {(selectedInvoice as { patient: { name?: string; ownerName?: string } }).patient.name} ({(selectedInvoice as { patient: { ownerName?: string } }).patient.ownerName})<br/>
                </>
              )}
              <strong>Toplam Tutar:</strong> {(ownerInvoices ? getInvoiceAmount(selectedInvoice as OwnerInvoiceOption) : (selectedInvoice as { total?: number }).total ?? 0).toFixed(2)} TL
            </div>
          )}

          {/* Ödeme Tutarı */}
          <div className="form-group">
            <label className="form-label">Ödeme Tutarı (TL)</label>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Ödeme Yöntemi */}
          <div className="form-group">
            <label className="form-label">Ödeme Yöntemi</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              required
            >
              <option value="cash">💵 Nakit</option>
              <option value="credit_card">💳 Kredi Kartı</option>
              <option value="debit_card">💳 Banka Kartı</option>
              <option value="bank_transfer">🏦 Havale/EFT</option>
              <option value="check">📝 Çek</option>
            </select>
          </div>

          {/* Nakit Ödeme Alanları */}
          {paymentMethod === 'cash' && (
            <>
              <div className="form-group">
                <label className="form-label">Alınan Nakit (TL)</label>
                <input
                  type="number"
                  className="form-input"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value))}
                  step="0.01"
                  min="0"
                  placeholder="Müşteriden alınan nakit miktarı"
                />
              </div>
              {changeGiven > 0 && (
                <div style={{ 
                  padding: 'var(--spacing-1)', 
                  background: '#f0fff4', 
                  color: '#2f855a',
                  borderRadius: 'var(--border-radius-sm)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  Para Üstü: {changeGiven.toFixed(2)} TL
                </div>
              )}
            </>
          )}

          {/* Kart Ödeme Alanları */}
          {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
            <>
              <div className="form-group">
                <label className="form-label">POS Terminal</label>
                <select
                  className="form-select"
                  value={selectedPosTerminal}
                  onChange={(e) => setSelectedPosTerminal(e.target.value)}
                  required
                >
                  {posTerminals.map(terminal => (
                    <option key={terminal.id} value={terminal.id}>
                      {terminal.name} ({terminal.bank})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)' }}>
                <div className="form-group">
                  <label className="form-label">Kart Türü</label>
                  <select
                    className="form-select"
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value as any)}
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="troy">Troy</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Son 4 Hanesi</label>
                  <input
                    type="text"
                    className="form-input"
                    value={lastFourDigits}
                    onChange={(e) => setLastFourDigits(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Kart Sahibi Adı</label>
                <input
                  type="text"
                  className="form-input"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
                  placeholder="KART SAHİBİNİN ADI"
                />
              </div>

              {processingCard && (
                <div style={{ 
                  padding: 'var(--spacing-2)', 
                  background: '#fff3cd', 
                  color: '#856404',
                  borderRadius: 'var(--border-radius-sm)',
                  textAlign: 'center'
                }}>
                  🔄 POS işlemi gerçekleştiriliyor... Lütfen bekleyin.
                </div>
              )}
            </>
          )}

          {/* Havale Alanları */}
          {paymentMethod === 'bank_transfer' && (
            <>
              <div className="form-group">
                <label className="form-label">Banka Hesap No</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="TR33 0006 1005 1978 6457 8413 26"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Referans Numarası</label>
                <input
                  type="text"
                  className="form-input"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Havale referans numarası"
                />
              </div>
            </>
          )}

          {/* Çek Alanları */}
          {paymentMethod === 'check' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)' }}>
                <div className="form-group">
                  <label className="form-label">Çek Numarası</label>
                  <input
                    type="text"
                    className="form-input"
                    value={checkNumber}
                    onChange={(e) => setCheckNumber(e.target.value)}
                    placeholder="123456"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Çek Tarihi</label>
                  <input
                    type="date"
                    className="form-input"
                    value={checkDate}
                    onChange={(e) => setCheckDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Banka</label>
                <input
                  type="text"
                  className="form-input"
                  value={checkBank}
                  onChange={(e) => setCheckBank(e.target.value)}
                  placeholder="Ziraat Bankası"
                />
              </div>
            </>
          )}

          {/* Açıklama */}
          <div className="form-group">
            <label className="form-label">Açıklama</label>
            <textarea
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ödeme ile ilgili notlar..."
              rows={3}
            />
          </div>

          {/* Butonlar */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 'var(--spacing-1)',
            paddingTop: 'var(--spacing-2)',
            borderTop: '1px solid rgba(0,0,0,0.04)'
          }}>
            <button
              type="button"
              className="action-button"
              onClick={onClose}
              style={{ background: 'var(--surface-variant)', color: 'var(--text-primary)' }}
            >
              İptal
            </button>
            <button
              type="submit"
              className="action-button"
              disabled={loading || processingCard || (!!ownerInvoices && unpaidInvoices.length === 0)}
            >
              {loading ? '⏳ Kaydediliyor...' : processingCard ? '💳 POS İşlemi...' : '💰 Ödeme Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 