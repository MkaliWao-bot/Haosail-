import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Category, PowerSource, Product } from '../types/machinery';
import { CATEGORIES_CONFIG } from '../data/machineryData';
import { STUDIO_IMAGE_PRESETS } from '../data/studioImageLibrary';
import { CreateCatalogProductInput } from '../context/CatalogOverridesContext';

interface AddEditEquipmentModalProps {
  isOpen: boolean;
  editingProduct?: Product | null;
  onClose: () => void;
  onSubmit: (
    input: CreateCatalogProductInput,
    existingProductId?: string
  ) => Promise<{ ok: boolean; error?: string }>;
}

const DIVISION_OPTIONS = CATEGORIES_CONFIG.filter((c) => c.id !== 'all') as Array<{
  id: Exclude<Category, 'all'>;
  label: string;
  subCategories?: Array<{ id: string; label: string }>;
}>;

export const AddEditEquipmentModal: React.FC<AddEditEquipmentModalProps> = ({
  isOpen,
  editingProduct,
  onClose,
  onSubmit,
}) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'all'>>('woodworking');
  const [subCategory, setSubCategory] = useState('');
  const [priceKes, setPriceKes] = useState('185000');
  const [originalPriceKes, setOriginalPriceKes] = useState('');
  const [stockCount, setStockCount] = useState('6');
  const [inStock, setInStock] = useState(true);
  const [freightTier, setFreightTier] = useState<Product['freightTier']>('freight-ltl');
  const [isFreeFreight, setIsFreeFreight] = useState(true);
  const [powerSource, setPowerSource] = useState<PowerSource>('3-phase-400v');
  const [image, setImage] = useState(STUDIO_IMAGE_PRESETS[0]?.src || '');
  const [motor, setMotor] = useState('4.0 kW Industrial Induction Motor');
  const [voltage, setVoltage] = useState('415V / 3-Phase 50Hz');
  const [amperage, setAmperage] = useState('16A');
  const [capacity, setCapacity] = useState('Commercial Production Duty');
  const [footprint, setFootprint] = useState('1450 x 900 x 1150 mm');
  const [weightLbs, setWeightLbs] = useState('420');
  const [warrantyYears, setWarrantyYears] = useState('2');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState(
    'Heavy cast-iron worktable for zero vibration\nKenya grid thermal overload & emergency stop\nBacked by Nairobi Industrial Area spare parts'
  );
  const [includedText, setIncludedText] = useState(
    'Main Machine Assembly\nStandard Tooling & Guard Kit\nOperator Manual & Calibration Certificate'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    if (editingProduct) {
      setSku(editingProduct.sku);
      setName(editingProduct.name);
      setSubtitle(editingProduct.subtitle);
      setCategory(
        editingProduct.category === 'all' ? 'woodworking' : editingProduct.category
      );
      setSubCategory(editingProduct.subCategory || '');
      setPriceKes(String(editingProduct.price));
      setOriginalPriceKes(
        editingProduct.originalPrice ? String(editingProduct.originalPrice) : ''
      );
      setStockCount(String(editingProduct.stockCount));
      setInStock(editingProduct.inStock);
      setFreightTier(editingProduct.freightTier);
      setIsFreeFreight(editingProduct.isFreeFreight);
      setPowerSource(editingProduct.powerSource);
      setImage(editingProduct.image);
      setMotor(editingProduct.specs.motor);
      setVoltage(editingProduct.specs.voltage);
      setAmperage(editingProduct.specs.amperage);
      setCapacity(editingProduct.specs.capacity);
      setFootprint(editingProduct.specs.footprint);
      setWeightLbs(String(editingProduct.specs.weightLbs));
      setWarrantyYears(String(editingProduct.specs.warrantyYears));
      setDescription(editingProduct.description);
      setFeaturesText(editingProduct.features.join('\n'));
      setIncludedText(editingProduct.includedItems.join('\n'));
    } else {
      setSku('HS-NEW-101');
      setName('');
      setSubtitle('');
      setCategory('woodworking');
      setSubCategory('');
      setPriceKes('185000');
      setOriginalPriceKes('');
      setStockCount('6');
      setInStock(true);
      setFreightTier('freight-ltl');
      setIsFreeFreight(true);
      setPowerSource('3-phase-400v');
      setImage(STUDIO_IMAGE_PRESETS[0]?.src || '');
      setMotor('4.0 kW Industrial Induction Motor');
      setVoltage('415V / 3-Phase 50Hz');
      setAmperage('16A');
      setCapacity('Commercial Production Duty');
      setFootprint('1450 x 900 x 1150 mm');
      setWeightLbs('420');
      setWarrantyYears('2');
      setDescription('');
      setFeaturesText(
        'Heavy cast-iron worktable for zero vibration\nKenya grid thermal overload & emergency stop\nBacked by Nairobi Industrial Area spare parts'
      );
      setIncludedText(
        'Main Machine Assembly\nStandard Tooling & Guard Kit\nOperator Manual & Calibration Certificate'
      );
    }
  }, [isOpen, editingProduct]);

  if (!isOpen) return null;

  const selectedCategoryObj =
    DIVISION_OPTIONS.find((c) => c.id === category) || DIVISION_OPTIONS[0];
  const subCatOptions = (selectedCategoryObj.subCategories || []).filter(
    (s) => !s.id.startsWith('all-')
  );
  const selectedSubObj = subCatOptions.find((s) => s.id === subCategory);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsedPrice = Number(priceKes);
    const parsedStock = Number(stockCount);
    const parsedWeight = Number(weightLbs);
    const parsedWarranty = Number(warrantyYears);

    if (!sku.trim() || sku.trim().length < 2) {
      setErrorMsg('Enter a valid SKU code (minimum 2 characters).');
      return;
    }
    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Enter the machine model name.');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 100 || parsedPrice > 50_000_000) {
      setErrorMsg('Price must be between KES 100 and KES 50,000,000.');
      return;
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0 || parsedStock > 10_000) {
      setErrorMsg('Yard stock count must be between 0 and 10,000.');
      return;
    }
    if (!image.trim()) {
      setErrorMsg('Choose a studio photo preset or enter a valid image path/URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const features = featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12);
      const includedItems = includedText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 12);

      const res = await onSubmit(
        {
          sku: sku.trim(),
          name: name.trim(),
          subtitle: subtitle.trim() || `${selectedCategoryObj.label} equipment ready for dispatch`,
          category,
          categoryLabel: selectedCategoryObj.label,
          subCategory: selectedSubObj?.id,
          subCategoryLabel: selectedSubObj?.label,
          priceKes: parsedPrice,
          originalPriceKes: originalPriceKes ? Number(originalPriceKes) : undefined,
          stockCount: parsedStock,
          inStock,
          freightTier,
          isFreeFreight,
          isNewArrival: true,
          image: image.trim(),
          powerSource,
          motor: motor.trim(),
          voltage: voltage.trim(),
          amperage: amperage.trim(),
          capacity: capacity.trim(),
          footprint: footprint.trim(),
          weightLbs: Number.isFinite(parsedWeight) && parsedWeight >= 1 ? parsedWeight : 250,
          warrantyYears:
            Number.isFinite(parsedWarranty) && parsedWarranty >= 1 ? parsedWarranty : 2,
          description:
            description.trim() ||
            `${name.trim()} stocked in Nairobi Industrial Area for nationwide Kenyan workshop deployment.`,
          features,
          includedItems,
        },
        editingProduct?.id
      );

      if (res.ok) {
        onClose();
      } else {
        setErrorMsg(res.error || 'Failed to save catalog item.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={editingProduct ? 'Edit Equipment Listing' : 'Add New Equipment'}
    >
      <div
        className="fixed inset-0 bg-[#0D0F12]/75 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative z-10 flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-6 py-4 shrink-0">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#004B97] dark:text-sky-400 block">
              Catalog Inventory Manager
            </span>
            <h3 className="font-display text-base font-bold text-[#111315] dark:text-white">
              {editingProduct ? `Edit Equipment: ${editingProduct.sku}` : 'Add New Equipment to Catalog'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close equipment form"
            className="rounded-md p-1.5 text-[#5A606B] dark:text-slate-400 hover:bg-[#E2E4E8] dark:hover:bg-[#262A33] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {errorMsg && (
            <div className="flex items-start gap-2 rounded-md border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-3 text-rose-800 dark:text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Core Identity & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-3">
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Model SKU *
              </label>
              <input
                type="text"
                required
                maxLength={40}
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="HS-CNC-1325"
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 font-mono text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Machine Title *
              </label>
              <input
                type="text"
                required
                maxLength={140}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="HaoSail Heavy-Duty 4-Side Planer Moulder"
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Division Category *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as Exclude<Category, 'all'>);
                  setSubCategory('');
                }}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none cursor-pointer"
              >
                {DIVISION_OPTIONS.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-8">
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Short Engineering Subtitle *
              </label>
              <input
                type="text"
                required
                maxLength={200}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="4-spindle precision timber profiling with variable feed drive"
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Sub-Category (Optional)
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none cursor-pointer"
              >
                <option value="">General Division Equipment</option>
                {subCatOptions.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing, Stock & Logistics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border-y border-[#E2E4E8] dark:border-[#262A33] py-4">
            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Cash Price (KES) *
              </label>
              <input
                type="number"
                required
                min={100}
                max={50000000}
                value={priceKes}
                onChange={(e) => setPriceKes(e.target.value)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 font-mono tabular-nums text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                List / Old Price (KES)
              </label>
              <input
                type="number"
                min={0}
                max={50000000}
                value={originalPriceKes}
                onChange={(e) => setOriginalPriceKes(e.target.value)}
                placeholder="Optional"
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 font-mono tabular-nums text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Yard Stock Units *
              </label>
              <input
                type="number"
                required
                min={0}
                max={10000}
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 font-mono tabular-nums text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Freight Class *
              </label>
              <select
                value={freightTier}
                onChange={(e) => setFreightTier(e.target.value as Product['freightTier'])}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-2 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none cursor-pointer"
              >
                <option value="standard-ground">Standard Van</option>
                <option value="freight-ltl">Commercial LTL</option>
                <option value="heavy-freight">Heavy Tailgate</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Power Supply *
              </label>
              <select
                value={powerSource}
                onChange={(e) => setPowerSource(e.target.value as PowerSource)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-2 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none cursor-pointer"
              >
                <option value="3-phase-400v">400V 3-Phase</option>
                <option value="corded-230v">230V Single-Phase</option>
                <option value="engine-manual">Diesel / Manual</option>
                <option value="cordless-18v">Cordless Battery</option>
              </select>
            </div>
          </div>

          {/* Availability Toggles */}
          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-[#111315] dark:text-slate-200">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="rounded border-slate-300 text-[#004B97] cursor-pointer"
              />
              <span>In Stock &amp; Ready for Nairobi Dispatch</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-[#111315] dark:text-slate-200">
              <input
                type="checkbox"
                checked={isFreeFreight}
                onChange={(e) => setIsFreeFreight(e.target.checked)}
                className="rounded border-slate-300 text-[#004B97] cursor-pointer"
              />
              <span>Include Free Regional Freight</span>
            </label>
          </div>

          {/* Product Studio Image Picker */}
          <div className="space-y-2.5 border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-[#111315] dark:text-white flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
                <span>Product Image (Select Studio Preset or Paste Path/URL)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              <div className="md:col-span-8 space-y-2">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {STUDIO_IMAGE_PRESETS.map((preset) => {
                    const selected = image === preset.src;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setImage(preset.src)}
                        title={`${preset.label} (${preset.category})`}
                        className={`relative aspect-[4/3] overflow-hidden rounded-sm border transition-all cursor-pointer ${
                          selected
                            ? 'border-[#004B97] ring-2 ring-[#004B97]/40'
                            : 'border-[#E2E4E8] dark:border-[#262A33] opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.src}
                          alt={preset.label}
                          className="h-full w-full object-cover"
                        />
                        {selected && (
                          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#004B97] text-white">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  maxLength={1000}
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/assets/aistudio/... or https://..."
                  className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 font-mono text-[11px] text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                />
              </div>

              <div className="md:col-span-4 aspect-[4/3] overflow-hidden rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#ECECE8] dark:bg-[#1C2029]">
                {image ? (
                  <img
                    src={image}
                    alt="Selected equipment preview"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Engineering Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Motor / Engine
              </label>
              <input
                type="text"
                maxLength={100}
                value={motor}
                onChange={(e) => setMotor(e.target.value)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Voltage
              </label>
              <input
                type="text"
                maxLength={80}
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 font-mono text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Amperage
              </label>
              <input
                type="text"
                maxLength={60}
                value={amperage}
                onChange={(e) => setAmperage(e.target.value)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 font-mono text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                min={1}
                max={100000}
                value={weightLbs}
                onChange={(e) => setWeightLbs(e.target.value)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 font-mono tabular-nums text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Working Capacity
              </label>
              <input
                type="text"
                maxLength={120}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Footprint
              </label>
              <input
                type="text"
                maxLength={100}
                value={footprint}
                onChange={(e) => setFootprint(e.target.value)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 font-mono text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Warranty (Years)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={warrantyYears}
                onChange={(e) => setWarrantyYears(e.target.value)}
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2.5 py-1.5 font-mono tabular-nums text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>
          </div>

          {/* Description & Bullet Lists */}
          <div className="space-y-3 border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
            <div>
              <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                Technical Description
              </label>
              <textarea
                rows={2}
                maxLength={1500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Commercial workshop specification overview..."
                className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                  Key Features (one per line, max 12)
                </label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1">
                  Included in Crate (one per line, max 12)
                </label>
                <textarea
                  rows={3}
                  value={includedText}
                  onChange={(e) => setIncludedText(e.target.value)}
                  className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-[#111315] dark:text-white focus:border-[#004B97] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] px-4 py-2 font-medium text-[#5A606B] dark:text-slate-300 hover:text-[#111315] dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-press rounded-md bg-[#004B97] hover:bg-[#003B78] px-5 py-2 font-semibold text-white cursor-pointer disabled:opacity-60"
            >
              {isSubmitting
                ? 'Saving to Catalog...'
                : editingProduct
                  ? 'Save Changes'
                  : 'Publish to Live Storefront'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
