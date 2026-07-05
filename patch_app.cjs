const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const listContentStart = code.indexOf('{/* App Header (System Bar & Navbar) */}');
const leftColumnEnd = code.indexOf('{/* Right Column: Management Backend View - Admin */}');

// The closing div of Left Column is right before Right Column.
const listContentEnd = code.lastIndexOf('</div>', leftColumnEnd - 1) + 6;

// I'll grab the entire list content
const listContent = code.substring(listContentStart, listContentEnd);

const newContent = `{appStep === 'list' && (
  <div className="flex flex-col h-full relative">
${listContent.split('\n').map(line => '    ' + line).join('\n')}
  </div>
)}

{appStep === 'experience' && (
  <div className="flex-1 flex flex-col bg-[#f5f5f5]">
    <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-center border-b border-gray-100 shrink-0 sticky top-0 z-20 shadow-sm relative">
      <button onClick={() => setAppStep('list')} className="absolute left-4 p-1 active:scale-95 transition-transform">
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <h1 className="text-lg font-bold text-gray-900 tracking-wide">申请打包</h1>
    </div>
    <div className="p-4 space-y-4 flex-1">
      <h2 className="text-lg font-bold text-gray-800 mb-4 mt-2">选择您的打包模式</h2>
      <div 
        onClick={() => { setPackExp('novice'); setAppStep('priority'); }}
        className="bg-white p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-transparent hover:border-blue-300 active:scale-95 transition-all cursor-pointer flex items-center gap-4 group"
      >
        <div className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">👦</div>
        <div>
          <h3 className="text-base font-bold text-gray-800">新手省心模式</h3>
          <p className="text-xs text-gray-500 mt-1">跟着向导选，智能推荐最适合的路线</p>
        </div>
      </div>
      <div 
        onClick={() => { setPackExp('expert'); setAppStep('addons'); }}
        className="bg-white p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-transparent hover:border-pink-300 active:scale-95 transition-all cursor-pointer flex items-center gap-4 group"
      >
        <div className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">🧙‍♂️</div>
        <div>
          <h3 className="text-base font-bold text-gray-800">老手自定义模式</h3>
          <p className="text-xs text-gray-500 mt-1">我已了如指掌，直接进行高级配置</p>
        </div>
      </div>
    </div>
  </div>
)}

{appStep === 'priority' && (
  <div className="flex-1 flex flex-col bg-[#f5f5f5]">
    <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-center border-b border-gray-100 shrink-0 sticky top-0 z-20 shadow-sm relative">
      <button onClick={() => setAppStep('experience')} className="absolute left-4 p-1 active:scale-95 transition-transform">
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <h1 className="text-lg font-bold text-gray-900 tracking-wide">您的偏好</h1>
    </div>
    <div className="p-4 space-y-4 flex-1">
      <h2 className="text-lg font-bold text-gray-800 mb-4 mt-2">您更看重什么？</h2>
      <div 
        onClick={() => { setPackPriority('weight'); setAppStep('addons'); }}
        className="bg-white p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-transparent hover:border-blue-300 active:scale-95 transition-all cursor-pointer flex items-center gap-4 group"
      >
        <div className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">⚖️</div>
        <div>
          <h3 className="text-base font-bold text-gray-800">极致控重</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">优先推荐按重量计费的邮政类路线，尽量压缩包裹重量</p>
        </div>
      </div>
      <div 
        onClick={() => { setPackPriority('volume'); setAppStep('addons'); }}
        className="bg-white p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-transparent hover:border-pink-300 active:scale-95 transition-all cursor-pointer flex items-center gap-4 group"
      >
        <div className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform">📦</div>
        <div>
          <h3 className="text-base font-bold text-gray-800">极致控体积</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">优先推荐包税专线，适合重小件，尽量压缩体积</p>
        </div>
      </div>
    </div>
  </div>
)}

{appStep === 'addons' && (
  <div className="flex-1 flex flex-col bg-[#f5f5f5]">
    <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-center border-b border-gray-100 shrink-0 sticky top-0 z-20 shadow-sm relative">
      <button onClick={() => setAppStep(packExp === 'novice' ? 'priority' : 'experience')} className="absolute left-4 p-1 active:scale-95 transition-transform">
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <h1 className="text-lg font-bold text-gray-900 tracking-wide">附加服务</h1>
    </div>
    <div className="p-4 space-y-3 flex-1 overflow-y-auto pb-24">
      <h2 className="text-lg font-bold text-gray-800 mb-2 mt-2">需要哪些额外服务？</h2>
      {ADDONS_LIST.map(addon => {
        const isSelected = packAddons.includes(addon.id);
        return (
          <div 
            key={addon.id}
            onClick={() => setPackAddons(prev => prev.includes(addon.id) ? prev.filter(id => id !== addon.id) : [...prev, addon.id])}
            className={\`bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border-2 transition-all cursor-pointer flex items-center justify-between \${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-transparent hover:border-blue-100'}\`}
          >
            <div className="pr-4">
              <h3 className="text-[14px] font-bold text-gray-800">{addon.name}</h3>
              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{addon.desc}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-bold text-rose-500 font-mono">+{addon.price}円</span>
              <div className={\`mt-2 w-5 h-5 rounded-full border-2 mx-auto flex items-center justify-center transition-colors \${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}\`}>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <div className="bg-white p-4 border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] relative z-30">
      <button 
        onClick={() => setAppStep('logistics')}
        className="w-full bg-[#ffd200] hover:bg-[#f5c900] text-gray-900 font-bold py-3.5 rounded-xl active:scale-95 transition-all shadow-sm text-sm"
      >
        下一步
      </button>
    </div>
  </div>
)}

{appStep === 'logistics' && (
  <div className="flex-1 flex flex-col bg-[#f5f5f5]">
    <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-center border-b border-gray-100 shrink-0 sticky top-0 z-20 shadow-sm relative">
      <button onClick={() => setAppStep('addons')} className="absolute left-4 p-1 active:scale-95 transition-transform">
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <h1 className="text-lg font-bold text-gray-900 tracking-wide">确认打包申请</h1>
    </div>
    
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
      {/* 专家模式备注区 */}
      {packExp === 'expert' && (
        <div className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <h2 className="text-[13px] font-bold text-gray-800 mb-2 flex items-center gap-1.5"><PenLine className="w-4 h-4 text-blue-500" />高级备注 (老手专属)</h2>
          <textarea 
            value={packNote}
            onChange={(e) => setPackNote(e.target.value)}
            placeholder="例如：请用k60纸箱打包，控制在500g以内..."
            className="w-full h-20 bg-gray-50 border border-gray-200 rounded-lg p-3 text-[13px] resize-none focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>
      )}
      
      {/* 路线选择 */}
      <div className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <h2 className="text-[13px] font-bold text-gray-800 mb-3 flex items-center gap-1.5"><Truck className="w-4 h-4 text-rose-500" />{packExp === 'novice' ? '智能推荐路线' : '选择路线'}</h2>
        <div className="space-y-2">
          {[...LOGISTICS_ROUTES].sort((a, b) => {
            if (packExp === 'expert') return 0;
            if (packPriority === 'weight') {
              return a.type === 'weight' && b.type !== 'weight' ? -1 : a.type !== 'weight' && b.type === 'weight' ? 1 : 0;
            }
            if (packPriority === 'volume') {
              return a.type === 'volume' && b.type !== 'volume' ? -1 : a.type !== 'volume' && b.type === 'volume' ? 1 : 0;
            }
            return 0;
          }).map((route, index) => {
            const isRecommended = packExp === 'novice' && (route.type === packPriority);
            return (
              <div 
                key={route.id}
                onClick={() => setPackLogistics(route.id)}
                className={\`p-3 rounded-lg border-2 flex items-center justify-between cursor-pointer transition-all \${packLogistics === route.id ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'}\`}
              >
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-gray-800">{route.name}</span>
                    {isRecommended && <span className="bg-rose-100 text-rose-500 text-[9px] px-1.5 py-0.5 rounded font-bold">推荐</span>}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{route.desc}</p>
                </div>
                <div className={\`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors \${packLogistics === route.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}\`}>
                  {packLogistics === route.id && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* 附加服务确认 */}
      {packAddons.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <h2 className="text-[13px] font-bold text-gray-800 mb-2 flex items-center gap-1.5"><PackagePlus className="w-4 h-4 text-emerald-500" />已选附加服务</h2>
          <div className="space-y-1.5 mt-3">
            {packAddons.map(id => {
              const addon = ADDONS_LIST.find(a => a.id === id);
              return (
                <div key={id} className="flex justify-between text-[13px]">
                  <span className="text-gray-600">{addon?.name}</span>
                  <span className="text-rose-500 font-mono font-bold">+{addon?.price}円</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
    
    <div className="bg-white p-4 border-t border-gray-200 absolute bottom-0 left-0 right-0 z-30 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[13px] text-gray-600 font-bold">预计附加费</span>
        <span className="text-lg font-bold text-rose-500 font-mono">
          {packAddons.reduce((acc, id) => acc + (ADDONS_LIST.find(a => a.id === id)?.price || 0), 0)} <span className="text-sm">円</span>
        </span>
      </div>
      <button 
        className={\`w-full font-bold py-3.5 rounded-xl transition-all shadow-sm text-sm \${packLogistics ? 'bg-[#ffd200] hover:bg-[#f5c900] text-gray-900 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}\`}
      >
        确认提交打包
      </button>
    </div>
  </div>
)}`;

code = code.substring(0, listContentStart) + newContent + code.substring(listContentEnd);

fs.writeFileSync('src/App.tsx', code);
console.log("Successfully replaced left column content");
