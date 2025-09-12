import React, { useState } from 'react';
import { PageConfig } from '../../types/landing';
import { UI_STRINGS } from '../../strings/ui';

interface SectionInspectorProps {
  pageConfig: PageConfig;
  onUpdateSection: (sectionId: string, updates: any) => void;
  onDuplicateVariant: (sectionId: string) => void;
  lockedSections: Record<string, boolean>;
  onToggleLock: (sectionId: string) => void;
}

interface SectionEditForm {
  [key: string]: any;
}

export default function SectionInspector({
  pageConfig,
  onUpdateSection,
  onDuplicateVariant,
  lockedSections,
  onToggleLock
}: SectionInspectorProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SectionEditForm>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedSectionData = selectedSection 
    ? pageConfig.sections.find(s => s.id === selectedSection)
    : null;

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId);
    const section = pageConfig.sections.find(s => s.id === sectionId);
    if (section) {
      setEditForm(section.props);
      setErrors({});
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFormBlur = (field: string) => {
    // Basic validation
    const value = editForm[field];
    if (typeof value === 'string' && value.trim() === '') {
      setErrors(prev => ({ ...prev, [field]: 'This field is required' }));
    }
  };

  const handleSave = () => {
    if (!selectedSection) return;
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    const requiredFields = getRequiredFields(selectedSection);
    
    requiredFields.forEach(field => {
      const value = editForm[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onUpdateSection(selectedSection, editForm);
    setErrors({});
  };

  const getRequiredFields = (sectionId: string): string[] => {
    const fieldMap: Record<string, string[]> = {
      navbar: ['links'],
      hero: ['headline', 'primaryCta'],
      socialProof: ['logos'],
      features: ['items'],
      featureSpotlight: ['blocks'],
      testimonials: ['items'],
      metrics: ['items'],
      pricing: ['plans'],
      faq: ['items'],
      finalCta: ['headline', 'cta'],
      footer: ['columns']
    };
    return fieldMap[sectionId] || [];
  };

  const getFieldLabel = (field: string): string => {
    const labelMap: Record<string, string> = {
      headline: 'Headline',
      subhead: 'Subhead',
      primaryCta: 'Primary CTA',
      secondaryCta: 'Secondary CTA',
      cta: 'Call to Action',
      links: 'Navigation Links',
      logos: 'Client Logos',
      items: 'Items',
      blocks: 'Content Blocks',
      plans: 'Pricing Plans',
      columns: 'Footer Columns',
      caption: 'Caption',
      media: 'Media',
      fineprint: 'Fine Print'
    };
    return labelMap[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const renderFieldEditor = (field: string, value: any) => {
    const label = getFieldLabel(field);
    const error = errors[field];

    if (field === 'links' && Array.isArray(value)) {
      return (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
          {value.map((link: any, index: number) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={link.label || ''}
                onChange={(e) => {
                  const newLinks = [...value];
                  newLinks[index] = { ...newLinks[index], label: e.target.value };
                  handleFormChange(field, newLinks);
                }}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Link label"
              />
              <input
                type="text"
                value={link.href || ''}
                onChange={(e) => {
                  const newLinks = [...value];
                  newLinks[index] = { ...newLinks[index], href: e.target.value };
                  handleFormChange(field, newLinks);
                }}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="URL"
              />
            </div>
          ))}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    if (typeof value === 'string') {
      return (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
          <textarea
            value={value}
            onChange={(e) => handleFormChange(field, e.target.value)}
            onBlur={() => handleFormBlur(field)}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-300' : 'border-gray-300'
            }`}
            rows={field === 'headline' ? 2 : 4}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Section Inspector</h3>
      
      {/* Section List */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Sections</h4>
        <div className="space-y-2">
          {pageConfig.sections.map((section) => (
            <div key={section.id} className="flex items-center justify-between">
              <button
                onClick={() => handleSectionSelect(section.id)}
                className={`flex-1 text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="capitalize">
                    {section.id.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-xs text-gray-500">V{section.variant}</span>
                </div>
              </button>
              <button
                onClick={() => onToggleLock(section.id)}
                className={`ml-2 px-2 py-1 text-xs rounded transition-colors ${
                  lockedSections[section.id]
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={lockedSections[section.id] ? 'Unlock section' : 'Lock section'}
              >
                {lockedSections[section.id] ? '🔒' : '🔓'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section Editor */}
      {selectedSectionData && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700">
              Edit {selectedSectionData.id.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={() => onDuplicateVariant(selectedSectionData.id)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Duplicate
              </button>
            </div>
          </div>

          {/* Variant Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variant
            </label>
            <select
              value={selectedSectionData.variant}
              onChange={(e) => {
                const updates = { ...selectedSectionData, variant: parseInt(e.target.value) };
                onUpdateSection(selectedSectionData.id, updates);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <option key={num} value={num}>Variant {num}</option>
              ))}
            </select>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {Object.entries(selectedSectionData.props).map(([field, value]) => 
              renderFieldEditor(field, value)
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
