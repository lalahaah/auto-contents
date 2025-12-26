'use client';

import React from 'react';

interface Template {
    id: string;
    name: string;
    description: string;
    isPremium: boolean;
}

interface TemplateSelectorProps {
    templates: Template[];
    selectedId: string;
    onSelect: (id: string, isPremium: boolean) => void;
    disabled?: boolean;
}

export default function TemplateSelector({ templates, selectedId, onSelect, disabled }: TemplateSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
                <button
                    key={template.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(template.id, template.isPremium)}
                    className={`flex flex-col p-6 rounded-xl border-2 text-left smooth-transition h-full ${selectedId === template.id
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 ring-opacity-50'
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5'}`}
                >
                    <div className="flex justify-between items-start mb-2 w-full">
                        <span className={`font-bold ${selectedId === template.id ? 'text-blue-700' : 'text-gray-900'}`}>
                            {template.name}
                        </span>
                        {template.isPremium && (
                            <span className="px-2 py-1 rounded-md text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-white uppercase tracking-tight shadow-sm">
                                Premium
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{template.description}</p>

                    {selectedId === template.id && (
                        <div className="mt-4 flex items-center text-blue-600 text-xs font-bold">
                            <span className="mr-1">✓</span> 선택됨
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
