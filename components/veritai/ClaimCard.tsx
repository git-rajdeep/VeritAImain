'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Brain, AlertTriangle, Clock } from 'lucide-react'
import { VerdictBadge } from './VerdictBadge'
import { ConfidenceBar } from './ConfidenceBar'
import { SourceChip } from './SourceChip'
import type { Claim } from '@/lib/stores/verification-store'

interface ClaimCardProps {
  claim: Claim
  index: number
  defaultExpanded?: boolean
  className?: string
}

const verdictBorderColors = {
  true: 'border-l-green-v',
  false: 'border-l-red-v',
  partial: 'border-l-amber',
  unverifiable: 'border-l-muted-v',
}

export function ClaimCard({ claim, index, defaultExpanded = false, className }: ClaimCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={cn(
        'bg-[#0D1021] rounded-lg border border-[#1E2340] overflow-hidden',
        'border-l-4',
        verdictBorderColors[claim.verdict],
        className
      )}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start gap-4 text-left hover:bg-[#161C28]/50 transition-colors cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          {/* Top row: verdict badge, claim number, temporal/conflict badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <VerdictBadge verdict={claim.verdict} size="sm" />
            <span className="text-xs text-muted-v font-mono">Claim #{index + 1}</span>
            {claim.isTemporal && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan/20 text-cyan text-[10px] font-medium">
                <Clock className="w-3 h-3" />
                Time-sensitive
              </span>
            )}
            {claim.hasConflict && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber/20 text-amber text-[10px] font-medium">
                <AlertTriangle className="w-3 h-3" />
                Conflicting evidence
              </span>
            )}
          </div>
          
          {/* Claim text */}
          <p className="text-white font-medium leading-relaxed">
            {claim.text}
          </p>
        </div>
        
        {/* Expand/collapse chevron */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-muted-v" />
        </motion.div>
      </button>
      
      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-[#1E2340] pt-4">
              {/* AI Reasoning */}
              <div className="bg-[#0C1018] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-cyan" />
                  <span className="text-xs font-mono text-cyan uppercase tracking-wider">
                    AI Reasoning Log
                  </span>
                </div>
                <p className="text-sm text-muted-v leading-relaxed font-mono">
                  {claim.reasoning}
                </p>
              </div>
              
              {/* Conflict warning */}
              {claim.hasConflict && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber/10 border border-amber/20">
                  <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber">Conflicting Evidence Detected</p>
                    <p className="text-xs text-muted-v mt-1">
                      Multiple sources provide contradictory information. Review sources carefully.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Confidence bar */}
              <ConfidenceBar value={claim.confidence} verdict={claim.verdict} />
              
              {/* Sources */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs text-muted-v font-medium">Sources:</span>

                  {/* Tier info button */}
                  <div className="relative group/tier">
                    <button
                      type="button"
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-muted-v border border-border-v hover:border-violet-500/50 hover:text-violet-400 transition-all duration-150 cursor-default leading-none"
                      aria-label="Source tier information"
                    >
                      i
                    </button>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none opacity-0 group-hover/tier:opacity-100 transition-opacity duration-200">
                      <div className="bg-[#0D1021] border border-[#1E2340] rounded-xl p-3 w-[210px] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
                          Source Trust Tiers
                        </p>

                        {/* Tier 1 */}
                        <div className="flex items-start gap-2.5 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] shrink-0 mt-[3px]" />
                          <div>
                            <p className="text-[11px] font-semibold text-white leading-tight">Tier 1 — High Trust</p>
                            <p className="text-[10px] text-neutral-500 leading-snug mt-0.5">Reuters, BBC, Gov sites, Academic journals</p>
                          </div>
                        </div>

                        {/* Tier 2 */}
                        <div className="flex items-start gap-2.5 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa] shrink-0 mt-[3px]" />
                          <div>
                            <p className="text-[11px] font-semibold text-white leading-tight">Tier 2 — Moderate Trust</p>
                            <p className="text-[10px] text-neutral-500 leading-snug mt-0.5">Established news outlets, Wikipedia</p>
                          </div>
                        </div>

                        {/* Tier 3 */}
                        <div className="flex items-start gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#737373] shrink-0 mt-[3px]" />
                          <div>
                            <p className="text-[11px] font-semibold text-white leading-tight">Tier 3 — Low Trust</p>
                            <p className="text-[10px] text-neutral-500 leading-snug mt-0.5">Blogs, forums, unverified sources</p>
                          </div>
                        </div>

                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#1E2340]" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {claim.sources.map((source, idx) => (
                    <SourceChip
                      key={idx}
                      domain={source.domain}
                      url={source.url}
                      tier={source.tier}
                      title={source.title}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
