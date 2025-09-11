import React from 'react';
import { STYLE_GROUPS, StyleSlug, getStyleName } from '../../styles/styleGroups';
import { getAvailableStyles, getVariantsByStyle } from '../../generator/registry';
import { SectionID } from '../../types/landing';

interface StyleFilterProps {
  sectionId: SectionID;
  currentVariant: number;
  onVariantChange: (variant: number) => void;
  className?: string;
}

export const StyleFilter: React.FC<StyleFilterProps> = ({
  sectionId,
  currentVariant,
  onVariantChange,
  className = ''
}) => {
  const availableStyles = getAvailableStyles(sectionId);
  
  // If no styles are available (no variants generated yet), don't render
  if (availableStyles.length === 0) {
    return null;
  }

  const handleStyleChange = (style: StyleSlug) => {
    const variantsInStyle = getVariantsByStyle(sectionId, style);
    if (variantsInStyle.length > 0) {
      // Pick the first variant in the selected style
      onVariantChange(variantsInStyle[0]);
    }
  };

  const getCurrentStyle = (): StyleSlug | null => {
    // Find which style the current variant belongs to
    for (const style of availableStyles) {
      const variantsInStyle = getVariantsByStyle(sectionId, style);
      if (variantsInStyle.includes(currentVariant)) {
        return style;
      }
    }
    return null;
  };

  const currentStyle = getCurrentStyle();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label htmlFor="style-filter" className="text-sm font-medium text-gray-700">
        Style:
      </label>
      <select
        id="style-filter"
        value={currentStyle || ''}
        onChange={(e) => handleStyleChange(e.target.value as StyleSlug)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Styles</option>
        {STYLE_GROUPS
          .filter(style => availableStyles.includes(style.slug))
          .map(style => (
            <option key={style.slug} value={style.slug}>
              {style.name}
            </option>
          ))}
      </select>
      
      {currentStyle && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {getVariantsByStyle(sectionId, currentStyle).length} variants
          </span>
          <div className="flex gap-1">
            {getVariantsByStyle(sectionId, currentStyle).map((variant, index) => (
              <button
                key={variant}
                onClick={() => onVariantChange(variant)}
                className={`w-6 h-6 text-xs rounded border transition-colors ${
                  variant === currentVariant
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
                title={`Variant ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleFilter;
