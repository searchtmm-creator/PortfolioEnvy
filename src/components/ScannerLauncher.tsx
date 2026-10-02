import { useId, useState } from 'react';
import { playSound } from '../services/sound';

export function ScannerLauncher({ isMuted, onActivate }: { isMuted: boolean; onActivate: () => void }) {
  const infoId = useId();
  const [showInfo, setShowInfo] = useState(false);
  return <div className="w-full border border-zinc-800 bg-black p-3 font-mono text-xs shadow-[3px_3px_0px_#27272a]">
    <div className="flex justify-between items-center mb-3"><span className="text-zinc-500">// ENVY INDEX</span><button aria-label="About the envy scanner" aria-expanded={showInfo} aria-controls={infoId} onClick={() => { playSound('click', isMuted); setShowInfo(value => !value); }} className="px-2 py-1 border border-zinc-800">ii</button></div>
    <p id={infoId} hidden={!showInfo} className="text-zinc-400 leading-relaxed mb-3">An interactive experiment using your camera. Images are processed locally. You can view every project without activating it.</p>
    <div className="mb-4 text-zinc-500">Scanner on standby</div>
    <button className="w-full bg-white text-black py-2 font-bold text-[10px] uppercase hover:bg-brand-orange" onClick={() => { playSound('click', isMuted); onActivate(); }}>[ Activate Envy Scanner ]</button>
  </div>;
}
