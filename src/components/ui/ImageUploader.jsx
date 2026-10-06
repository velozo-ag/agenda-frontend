import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, Image as ImageIcon, X, Check, Link as LinkIcon } from 'lucide-react';
import { uploadService } from '../../services/uploadService';
import { getImageUrl } from '../../utils/imageUrl';

export function ImageUploader({
  value = '',
  onChange,
  type = 'products',
  label = 'Imagen',
  description = 'JPG, PNG o WEBP (máx. 5MB)',
  className = '',
  previewAspect = 'square',
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Solo se admiten archivos de imagen (JPG, PNG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('La imagen no puede superar los 5MB');
      return;
    }

    setErrorMessage('');
    setIsUploading(true);

    try {
      const data = await uploadService.uploadImage(file, type);
      if (data?.url) {
        onChange?.(data.url);
        setManualUrl(data.url);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error al subir la imagen al servidor');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setIsDragging(false);
      dragCounter.current = 0;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleManualUrlSave = (e) => {
    e.preventDefault();
    onChange?.(manualUrl.trim());
    setShowUrlInput(false);
  };

  const handleClear = () => {
    onChange?.('');
    setManualUrl('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-400 font-mono">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-zinc-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 font-mono flex items-center gap-1 transition-colors cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Subir archivo' : 'Pegar URL'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <form onSubmit={handleManualUrlSave} className="flex items-center gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://ejemplo.com/foto.jpg"
            className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 shadow-xs"
          />
          <button
            type="submit"
            className="btn-touch px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-200 dark:border-transparent cursor-pointer transition-colors shadow-xs"
          >
            Aplicar
          </button>
        </form>
      ) : (
        <div>
          {value ? (
            <div className="relative group rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 flex items-center gap-3 shadow-xs">
              <img
                src={getImageUrl(value)}
                alt="Uploaded preview"
                className={`rounded-xl object-contain p-1 border border-zinc-200 dark:border-zinc-800 shrink-0 bg-zinc-50 dark:bg-zinc-900/50 ${
                  previewAspect === 'banner' ? 'w-24 h-14' : 'w-14 h-14'
                }`}
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-mono text-zinc-800 dark:text-zinc-300 truncate block font-medium">
                  {value.split('/').pop()}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" />
                  <span>Imagen cargada</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-950/80 border border-zinc-200 dark:border-zinc-800 hover:border-rose-200 dark:hover:border-rose-800/80 text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors cursor-pointer shrink-0"
                title="Eliminar imagen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all duration-200 select-none ${
                isDragging
                  ? 'border-amber-500 bg-amber-500/10 scale-[1.02] shadow-lg ring-2 ring-amber-500/30'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-950/60 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {isUploading ? (
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 text-xs py-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Subiendo al servidor...</span>
                </div>
              ) : isDragging ? (
                <div className="py-2 text-center animate-bounce">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 flex items-center justify-center mx-auto mb-1.5">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-300">¡Soltá tu imagen acá!</p>
                  <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-mono">Se subirá automáticamente</p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center transition-colors shadow-xs">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Arrastrá tu imagen acá o <span className="text-amber-600 dark:text-amber-400 underline font-semibold">examinar</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                      {description}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {errorMessage && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-mono mt-1">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
