import React from 'react';

export interface TestimonialCardProps {
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    avatar: string;
}

export default function TestimonialCard({
    name,
    role,
    company,
    content,
    rating,
    avatar,
}: TestimonialCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover-lift">
            <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                    <span className="text-4xl">{avatar}</span>
                </div>
                <div className="ml-4">
                    <h4 className="text-base font-semibold text-gray-900">{name}</h4>
                    <p className="text-sm text-gray-600">
                        {role} · {company}
                    </p>
                </div>
            </div>

            {/* 별점 */}
            <div className="flex mb-3">
                {[...Array(rating)].map((_, i) => (
                    <svg
                        key={i}
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>

            <p className="text-gray-700 italic leading-relaxed">"{content}"</p>
        </div>
    );
}
