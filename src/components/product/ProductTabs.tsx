import React, { useState } from 'react'
import { Product } from '@/types/product'
import { MOCK_REVIEWS } from '@/data/mockProducts'
import { Star, Truck } from 'lucide-react'

interface ProductTabsProps {
  product: Product
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery' | 'reviews'>('desc')

  return (
    <div className="bg-white rounded-md border border-sand-300 shadow-subtle overflow-hidden">
      {/* Tab Navigation header */}
      <div className="flex border-b border-sand-200 bg-sand-50/60 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('desc')}
          className={`px-5 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'desc'
              ? 'border-forest-900 text-forest-950 bg-white font-bold'
              : 'border-transparent text-muted-foreground hover:text-forest-900'
          }`}
        >
          Description & Syllabus
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`px-5 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'specs'
              ? 'border-forest-900 text-forest-950 bg-white font-bold'
              : 'border-transparent text-muted-foreground hover:text-forest-900'
          }`}
        >
          Specifications ({product.specs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('delivery')}
          className={`px-5 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'delivery'
              ? 'border-forest-900 text-forest-950 bg-white font-bold'
              : 'border-transparent text-muted-foreground hover:text-forest-900'
          }`}
        >
          Hostel Delivery Guide
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`px-5 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'reviews'
              ? 'border-forest-900 text-forest-950 bg-white font-bold'
              : 'border-transparent text-muted-foreground hover:text-forest-900'
          }`}
        >
          Reviews ({product.reviewCount})
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'desc' && (
          <div className="space-y-4 text-xs sm:text-sm text-forest-900 leading-relaxed font-sans max-w-3xl">
            <p>{product.description}</p>
            <div className="pt-2">
              <h4 className="font-serif text-sm font-bold text-forest-950 mb-2">
                Why Students Recommend This Item:
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                <li>Selected and verified for official university semester coursework.</li>
                <li>Resistant to typical hostel and daily transit wear and tear.</li>
                <li>Eligible for immediate student exchange in case of courier transit defects.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-2xl">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                {product.specs.map((spec, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? 'bg-sand-50/50' : 'bg-white'}
                  >
                    <td className="py-2.5 px-4 font-semibold text-forest-950 w-1/3 border-b border-sand-200">
                      {spec.label}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground border-b border-sand-200">
                      {spec.value}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-forest-950 border-b border-sand-200">
                    Authenticity Guarantee
                  </td>
                  <td className="py-2.5 px-4 text-muted-foreground border-b border-sand-200">
                    100% genuine academic distributor edition
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-forest-900 leading-relaxed">
            <div className="flex items-start gap-3 p-4 bg-sand-50 rounded border border-sand-200">
              <Truck className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-forest-950">How Campus Deliveries Work</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  When our courier arrives at your university, you receive an automated SMS and call. You can collect your package at your hostel reception, gate security kiosk, or student center.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3 border border-sand-200 rounded">
                <h5 className="font-semibold text-forest-950 text-xs">Hostel Residents</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Specify your hostel wing & room number during checkout. Couriers leave packages with the warden desk if you are in class.
                </p>
              </div>
              <div className="p-3 border border-sand-200 rounded">
                <h5 className="font-semibold text-forest-950 text-xs">Day Scholars</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  Pickups available at Main Security Gate or Department Student Affairs Office from 9:00 AM to 5:00 PM.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between pb-4 border-b border-sand-200">
              <div>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="w-5 h-5 fill-amber-500" />
                  <span className="text-lg font-bold text-forest-950">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">out of 5.0</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Based on campus student feedback</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {MOCK_REVIEWS.map((rev) => (
                <div key={rev.id} className="p-3 rounded bg-sand-50/50 border border-sand-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-forest-950">{rev.author}</span>
                    <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                  </div>
                  <p className="text-[11px] text-forest-700 font-medium">{rev.university}</p>
                  <p className="text-muted-foreground leading-relaxed pt-1">&ldquo;{rev.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
