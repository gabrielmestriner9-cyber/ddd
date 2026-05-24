import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Camera,
  Upload,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  Ruler,
  Zap,
  Star,
  MessageCircle,
  ShoppingCart,
  X,
  RotateCcw,
} from 'lucide-react';
import { products } from '../data/products';
import type { Size, Measurements, FitResult, Product } from '../types';
import { useCart } from '../store/CartContext';

const STEPS = ['Sua Foto', 'Escolha a Peça', 'Resultado'];

const loadingMessages = [
  'Analisando proporções...',
  'Calculando medidas...',
  'Recomendando tamanho...',
  'Ajustando resultado...',
];

const sizeTable: Array<{ size: Size; bustMin: number; bustMax: number; label: string }> = [
  { size: 'PP', bustMin: 0, bustMax: 79, label: 'Extra Pequeno' },
  { size: 'P', bustMin: 80, bustMax: 87, label: 'Pequeno' },
  { size: 'M', bustMin: 88, bustMax: 95, label: 'Médio' },
  { size: 'G', bustMin: 96, bustMax: 103, label: 'Grande' },
  { size: 'GG', bustMin: 104, bustMax: 111, label: 'Extra Grande' },
  { size: 'XGG', bustMin: 112, bustMax: 999, label: 'Extra Extra Grande' },
];

const measurementTable: Record<Size, { bust: string; waist: string; hip: string }> = {
  PP: { bust: 'até 80cm', waist: 'até 62cm', hip: 'até 86cm' },
  P: { bust: '80–88cm', waist: '62–70cm', hip: '86–94cm' },
  M: { bust: '88–96cm', waist: '70–78cm', hip: '94–102cm' },
  G: { bust: '96–104cm', waist: '78–86cm', hip: '102–110cm' },
  GG: { bust: '104–112cm', waist: '86–94cm', hip: '110–118cm' },
  XGG: { bust: 'acima de 112cm', waist: 'acima de 94cm', hip: 'acima de 118cm' },
};

function calculateFitResult(measurements: Measurements, product: Product): FitResult {
  const bust = Number(measurements.bust);
  const waist = Number(measurements.waist);
  const hip = Number(measurements.hip);
  const height = Number(measurements.height);
  const weight = Number(measurements.weight);

  // Determine size by bust
  const entry = sizeTable.find((s) => bust >= s.bustMin && bust <= s.bustMax) || sizeTable[2];
  let recommendedSize = entry.size;

  // Check if product has this size; fallback to closest
  if (!product.sizes.includes(recommendedSize)) {
    const idx = sizeTable.findIndex((s) => s.size === recommendedSize);
    for (let delta = 1; delta <= 3; delta++) {
      if (idx + delta < sizeTable.length && product.sizes.includes(sizeTable[idx + delta].size)) {
        recommendedSize = sizeTable[idx + delta].size;
        break;
      }
      if (idx - delta >= 0 && product.sizes.includes(sizeTable[idx - delta].size)) {
        recommendedSize = sizeTable[idx - delta].size;
        break;
      }
    }
  }

  // Calculate fit score
  let fitScore = 82;
  if (bust > 0 && waist > 0) fitScore += 6;
  if (hip > 0) fitScore += 4;
  if (height > 0 && weight > 0) fitScore += 4;
  fitScore = Math.min(99, fitScore);

  // Build notes
  const notes: string[] = [];
  if (height > 175) {
    notes.push('Comprimento ideal para sua altura');
  } else if (height > 0) {
    notes.push('Modelagem confortável para o seu porte');
  }
  if (bust > 0) {
    notes.push('Largura ajustada nos ombros e peito');
  }
  if (waist > 0) {
    notes.push('Caimento natural na cintura');
  }
  if (notes.length === 0) {
    notes.push('Tamanho recomendado com base nas suas medidas', 'Verifique o guia de tamanhos para mais detalhes');
  }

  return { recommendedSize, fitScore, notes };
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${
                i < current
                  ? 'text-black'
                  : i === current
                  ? 'text-black'
                  : 'bg-[#1E1E1E] border border-white/10 text-gray-600'
              }`}
              style={
                i <= current
                  ? { backgroundColor: '#F0B429', boxShadow: i === current ? '0 0 20px rgba(240,180,41,0.4)' : undefined }
                  : undefined
              }
            >
              {i < current ? <Check size={16} /> : i + 1}
            </div>
            <span
              className={`text-[10px] font-semibold tracking-wide hidden sm:block ${
                i === current ? 'text-white' : 'text-gray-600'
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="w-12 sm:w-20 h-0.5 mb-5 rounded-full transition-all duration-300"
              style={{ backgroundColor: i < current ? '#F0B429' : '#1E1E1E' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function FittingRoom() {
  const [searchParams] = useSearchParams();
  const preselectedProductId = searchParams.get('product');
  const { addItem } = useCart();

  const [step, setStep] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    preselectedProductId ? (products.find((p) => p.id === preselectedProductId) || null) : null
  );
  const [measurements, setMeasurements] = useState<Measurements>({
    height: '',
    weight: '',
    bust: '',
    waist: '',
    hip: '',
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [fitResult, setFitResult] = useState<FitResult | null>(null);
  const [resultRevealed, setResultRevealed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Cycle loading messages
  useEffect(() => {
    if (!analyzing) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
    }, 620);
    return () => clearInterval(interval);
  }, [analyzing]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleAnalyze = () => {
    if (!selectedProduct) return;
    setAnalyzing(true);
    setLoadingMsgIdx(0);
    setFitResult(null);
    setResultRevealed(false);

    setTimeout(() => {
      const result = calculateFitResult(measurements, selectedProduct);
      setFitResult(result);
      setAnalyzing(false);
      setTimeout(() => setResultRevealed(true), 100);
    }, 2600);
  };

  const handleAddToCart = () => {
    if (!fitResult || !selectedProduct) return;
    const color = selectedProduct.colors[0];
    addItem(selectedProduct, fitResult.recommendedSize, color, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleShareWhatsApp = () => {
    if (!fitResult || !selectedProduct) return;
    const msg = encodeURIComponent(
      `✨ Acabei de usar o Provador IA da DNZ Outlet!\n\nProduto: ${selectedProduct.name}\nTamanho recomendado: ${fitResult.recommendedSize}\nAjuste: ${fitResult.fitScore}%\n\nQuero comprar! 🛍️`
    );
    window.open(`https://wa.me/5515999999999?text=${msg}`, '_blank');
  };

  const canProceedStep0 = !!photoUrl;
  const canProceedStep1 = !!selectedProduct;
  const canAnalyze = measurements.bust.length > 0 && measurements.height.length > 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-16">
      {/* Header */}
      <div
        className="relative py-10 px-4 sm:px-6 text-center overflow-hidden"
        style={{ backgroundColor: '#0D0D0D' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'radial-gradient(ellipse at center, #F0B429 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{ backgroundColor: 'rgba(240,180,41,0.15)', color: '#F0B429' }}
          >
            <Sparkles size={12} />
            INTELIGÊNCIA ARTIFICIAL
          </div>
          <h1 className="text-white font-black text-3xl sm:text-4xl">Provador Virtual com IA</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Descubra o tamanho ideal antes de comprar. Sem surpresas, sem devoluções.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <StepIndicator current={step} />

        {/* ─── STEP 0: Upload Photo ──────────────────── */}
        {step === 0 && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-full max-w-md">
              <h2 className="text-white font-black text-2xl mb-2 text-center">Upload sua Foto</h2>
              <p className="text-gray-500 text-sm text-center mb-6">
                Use uma foto de corpo inteiro para melhores resultados.
              </p>

              {/* Drop zone */}
              {!photoUrl ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full h-72 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 ${
                    dragging
                      ? 'border-[#F0B429] bg-[#F0B429]/5 scale-[1.01]'
                      : 'border-white/15 bg-[#161616] hover:border-[#F0B429]/50 hover:bg-[#1A1A1A]'
                  }`}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(240,180,41,0.1)' }}
                  >
                    <Upload size={28} style={{ color: '#F0B429' }} />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">
                      {dragging ? 'Solte a foto aqui!' : 'Arraste ou clique para fazer upload'}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">JPG, PNG ou WEBP até 10MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-[#161616]">
                  <img
                    src={photoUrl}
                    alt="Sua foto"
                    className="w-full h-full object-cover"
                  />
                  {/* Scan overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-0 right-0 h-0.5 scan-animation" style={{ backgroundColor: '#F0B429' }} />
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-transparent to-[#0A0A0A]/30" />
                    {/* Corner markers */}
                    {[
                      'top-3 left-3 border-t-2 border-l-2',
                      'top-3 right-3 border-t-2 border-r-2',
                      'bottom-3 left-3 border-b-2 border-l-2',
                      'bottom-3 right-3 border-b-2 border-r-2',
                    ].map((cls, i) => (
                      <div
                        key={i}
                        className={`absolute w-6 h-6 ${cls}`}
                        style={{ borderColor: '#F0B429' }}
                      />
                    ))}
                  </div>
                  {/* Remove */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setPhotoUrl(null); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors z-10"
                  >
                    <X size={14} />
                  </button>
                  <div
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-black"
                    style={{ backgroundColor: '#F0B429' }}
                  >
                    <Sparkles size={11} />
                    Foto carregada!
                  </div>
                </div>
              )}

              {/* Camera option */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all"
              >
                <Camera size={16} />
                Usar câmera
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleInputChange}
              />

              {/* Privacy note */}
              <p className="text-gray-600 text-xs text-center mt-4">
                🔒 Sua foto não é salva. Processamento 100% local no seu dispositivo.
              </p>
            </div>

            <button
              disabled={!canProceedStep0}
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all ${
                canProceedStep0
                  ? 'text-black hover:scale-105 active:scale-95'
                  : 'text-gray-600 bg-[#161616] cursor-not-allowed'
              }`}
              style={canProceedStep0 ? { backgroundColor: '#F0B429' } : undefined}
            >
              Continuar
              <ChevronRight size={16} />
            </button>

            {/* Skip option */}
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 hover:text-gray-400 text-xs underline transition-colors"
            >
              Pular foto e continuar
            </button>
          </div>
        )}

        {/* ─── STEP 1: Choose Product ────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-white font-black text-2xl mb-2">Escolha a Peça</h2>
              <p className="text-gray-500 text-sm">
                Selecione o produto que você quer experimentar.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {products.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`relative flex flex-col rounded-xl overflow-hidden border-2 transition-all duration-200 text-left hover:scale-[1.02] ${
                      isSelected ? 'scale-[1.02]' : 'border-white/10'
                    }`}
                    style={
                      isSelected
                        ? { borderColor: '#F0B429', boxShadow: '0 0 20px rgba(240,180,41,0.25)' }
                        : undefined
                    }
                  >
                    <div className="aspect-[3/4] bg-[#1E1E1E] overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 bg-[#161616]">
                      <p className="text-white text-xs font-semibold line-clamp-1">{p.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: '#F0B429' }}>
                        {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                    {isSelected && (
                      <div
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#F0B429' }}
                      >
                        <Check size={12} className="text-black" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(0)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors"
              >
                <ChevronLeft size={16} />
                Voltar
              </button>
              <button
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all ${
                  canProceedStep1
                    ? 'text-black hover:scale-105 active:scale-95'
                    : 'text-gray-600 bg-[#161616] cursor-not-allowed'
                }`}
                style={canProceedStep1 ? { backgroundColor: '#F0B429' } : undefined}
              >
                Continuar
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Measurements & Result ───────── */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-white font-black text-2xl mb-2">Medidas &amp; Resultado</h2>
              <p className="text-gray-500 text-sm">
                Informe suas medidas para uma recomendação precisa.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Form */}
              <div className="flex flex-col gap-5">
                {/* Selected product preview */}
                {selectedProduct && (
                  <div className="flex items-center gap-3 p-3 bg-[#161616] rounded-xl border border-white/10">
                    <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#1E1E1E]">
                      <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold line-clamp-1">{selectedProduct.name}</p>
                      <p className="text-[#F0B429] text-xs font-bold mt-0.5">
                        {selectedProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                    <button
                      onClick={() => { setStep(1); setFitResult(null); }}
                      className="text-gray-600 hover:text-gray-400 text-xs flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw size={12} />
                      Trocar
                    </button>
                  </div>
                )}

                {/* Measurements form */}
                <div className="bg-[#161616] rounded-2xl border border-white/10 p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler size={16} style={{ color: '#F0B429' }} />
                    <h3 className="text-white font-bold text-sm">Suas Medidas</h3>
                  </div>

                  {(
                    [
                      { key: 'height', label: 'Altura', unit: 'cm', placeholder: 'Ex: 170', required: true },
                      { key: 'weight', label: 'Peso', unit: 'kg', placeholder: 'Ex: 65', required: false },
                      { key: 'bust', label: 'Medida do Peito', unit: 'cm', placeholder: 'Ex: 92', required: true },
                      { key: 'waist', label: 'Cintura', unit: 'cm', placeholder: 'Ex: 74', required: false },
                      { key: 'hip', label: 'Quadril', unit: 'cm', placeholder: 'Ex: 98', required: false },
                    ] as Array<{ key: keyof Measurements; label: string; unit: string; placeholder: string; required: boolean }>
                  ).map(({ key, label, unit, placeholder, required }) => (
                    <div key={key}>
                      <label className="block text-gray-400 text-xs font-medium mb-1.5">
                        {label} ({unit})
                        {required && <span style={{ color: '#F0B429' }}> *</span>}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder={placeholder}
                          value={measurements[key]}
                          onChange={(e) =>
                            setMeasurements((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          className="w-full bg-[#1E1E1E] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#F0B429]/50 pr-12 transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs">
                          {unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  disabled={!canAnalyze || analyzing}
                  onClick={handleAnalyze}
                  className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black text-base transition-all ${
                    canAnalyze && !analyzing
                      ? 'text-black hover:scale-[1.02] active:scale-95'
                      : 'text-gray-600 bg-[#161616] cursor-not-allowed'
                  }`}
                  style={
                    canAnalyze && !analyzing
                      ? { backgroundColor: '#F0B429', boxShadow: '0 0 25px rgba(240,180,41,0.3)' }
                      : undefined
                  }
                >
                  {analyzing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                      {loadingMessages[loadingMsgIdx]}
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Analisar com IA
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors justify-center"
                >
                  <ChevronLeft size={16} />
                  Voltar
                </button>
              </div>

              {/* Right: Result */}
              <div>
                {!fitResult && !analyzing && (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center gap-4 bg-[#161616] rounded-2xl border border-white/5 p-8">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(240,180,41,0.08)' }}
                    >
                      <Sparkles size={32} style={{ color: '#F0B429' }} className="opacity-50" />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 font-medium text-sm">Preencha as medidas</p>
                      <p className="text-gray-700 text-xs mt-1">O resultado aparecerá aqui</p>
                    </div>
                  </div>
                )}

                {analyzing && (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center gap-6 bg-[#161616] rounded-2xl border border-white/5 p-8">
                    <div className="relative w-24 h-24">
                      {/* Spinning rings */}
                      <div
                        className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: '#F0B429', borderTopColor: 'transparent' }}
                      />
                      <div
                        className="absolute inset-2 rounded-full border-2 border-b-transparent animate-spin"
                        style={{
                          borderColor: 'rgba(240,180,41,0.4)',
                          borderBottomColor: 'transparent',
                          animationDirection: 'reverse',
                          animationDuration: '1.2s',
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={28} style={{ color: '#F0B429' }} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-base">{loadingMessages[loadingMsgIdx]}</p>
                      <p className="text-gray-600 text-xs mt-1">Por favor aguarde...</p>
                    </div>
                    <div className="w-full bg-[#1E1E1E] rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full rounded-full animate-pulse"
                        style={{ width: `${((loadingMsgIdx + 1) / loadingMessages.length) * 100}%`, backgroundColor: '#F0B429', transition: 'width 0.6s ease' }}
                      />
                    </div>
                  </div>
                )}

                {fitResult && selectedProduct && (
                  <div
                    className={`flex flex-col gap-5 transition-all duration-700 ${
                      resultRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {/* Main result card */}
                    <div
                      className="relative rounded-2xl p-6 flex flex-col items-center gap-4 overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #1a1500 0%, #161616 50%, #1a1500 100%)',
                        border: '1px solid rgba(240,180,41,0.3)',
                        boxShadow: '0 0 40px rgba(240,180,41,0.1)',
                      }}
                    >
                      {/* Background glow */}
                      <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-2xl opacity-20"
                        style={{ backgroundColor: '#F0B429' }}
                      />

                      <div className="relative text-center">
                        <p className="text-gray-400 text-xs font-medium tracking-widest uppercase mb-2">
                          Tamanho Recomendado
                        </p>
                        <div
                          className="text-7xl font-black leading-none"
                          style={{
                            color: '#F0B429',
                            textShadow: '0 0 40px rgba(240,180,41,0.5)',
                            animation: resultRevealed ? 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
                          }}
                        >
                          {fitResult.recommendedSize}
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          {fitResult.fitScore >= 95 ? 'Ajuste Perfeito' : fitResult.fitScore >= 85 ? 'Ótimo Ajuste' : 'Bom Ajuste'}
                        </p>
                      </div>

                      {/* Fit score */}
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-xs">Precisão</span>
                          <span className="font-black text-sm" style={{ color: '#F0B429' }}>
                            {fitResult.fitScore}%
                          </span>
                        </div>
                        <div className="w-full bg-[#1E1E1E] rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: resultRevealed ? `${fitResult.fitScore}%` : '0%',
                              backgroundColor: '#F0B429',
                              boxShadow: '0 0 10px rgba(240,180,41,0.5)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="w-full flex flex-col gap-2">
                        {fitResult.notes.map((note, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: 'rgba(240,180,41,0.2)' }}
                            >
                              <Check size={10} style={{ color: '#F0B429' }} />
                            </div>
                            <p className="text-gray-300 text-xs">{note}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product preview */}
                    <div className="relative rounded-xl overflow-hidden bg-[#161616] border border-white/10">
                      <div className="flex items-center gap-3 p-3">
                        <div className="w-14 h-18 rounded-lg overflow-hidden flex-shrink-0 bg-[#1E1E1E]">
                          <img
                            src={selectedProduct.images[0]}
                            alt={selectedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-semibold line-clamp-1">{selectedProduct.name}</p>
                          <p className="text-[#F0B429] text-xs font-black mt-0.5">
                            {selectedProduct.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        </div>
                        <div
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-black flex-shrink-0"
                          style={{ backgroundColor: '#F0B429' }}
                        >
                          <Check size={11} />
                          Vai cair bem!
                        </div>
                      </div>
                    </div>

                    {/* Size comparison table */}
                    <div className="bg-[#161616] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white text-xs font-bold">Tabela de Medidas</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="text-left px-4 py-2 text-gray-600 font-medium">Tam.</th>
                              <th className="text-left px-4 py-2 text-gray-600 font-medium">Peito</th>
                              <th className="text-left px-4 py-2 text-gray-600 font-medium">Cintura</th>
                              <th className="text-left px-4 py-2 text-gray-600 font-medium">Quadril</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(Object.entries(measurementTable) as [Size, typeof measurementTable.PP][]).map(
                              ([size, m]) => (
                                <tr
                                  key={size}
                                  className="border-b border-white/5"
                                  style={
                                    size === fitResult.recommendedSize
                                      ? { backgroundColor: 'rgba(240,180,41,0.08)' }
                                      : undefined
                                  }
                                >
                                  <td
                                    className="px-4 py-2 font-black"
                                    style={{
                                      color: size === fitResult.recommendedSize ? '#F0B429' : 'white',
                                    }}
                                  >
                                    {size}
                                    {size === fitResult.recommendedSize && (
                                      <Star size={8} className="inline ml-1 mb-0.5" style={{ color: '#F0B429' }} fill="#F0B429" />
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-gray-400">{m.bust}</td>
                                  <td className="px-4 py-2 text-gray-400">{m.waist}</td>
                                  <td className="px-4 py-2 text-gray-400">{m.hip}</td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleAddToCart}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all ${
                          addedToCart
                            ? 'bg-green-500 text-white'
                            : 'text-black hover:scale-[1.02] active:scale-95'
                        }`}
                        style={
                          !addedToCart
                            ? { backgroundColor: '#F0B429', boxShadow: '0 0 20px rgba(240,180,41,0.2)' }
                            : undefined
                        }
                      >
                        {addedToCart ? (
                          <>
                            <Check size={18} />
                            Adicionado ao Carrinho!
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={18} />
                            Adicionar ao Carrinho — {fitResult.recommendedSize}
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleShareWhatsApp}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: '#25D366' }}
                      >
                        <MessageCircle size={18} />
                        Compartilhar no WhatsApp
                      </button>

                      <Link
                        to={`/produto/${selectedProduct.id}`}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-all"
                      >
                        Ver produto completo
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
