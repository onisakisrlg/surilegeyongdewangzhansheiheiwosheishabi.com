const fs = require('fs');
let code = fs.readFileSync('src/components/Flow20260708.tsx', 'utf8');

code = code.replace(/<span className={`w-5 h-5 rounded-full flex items-center justify-center text-\[12px\] font-bold \$\{formActiveStep > 4 \? 'bg-green-500 text-white' : 'bg-blue-500 text-white'\}`}>/g, `<span className={\`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold \${formActiveStep > 4 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}\`}>`);

code = code.replace(/\{\/\* Step 4: 其他增值服务 \*\/\}\n\s*\{formActiveStep >= 5 && \(\n\s*<div ref=\{step4Ref\} className=\{`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 \$\{formActiveStep === 4 \? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'\}`\}>/g,
`{/* Step 5: 其他增值服务 */}
              {formActiveStep >= 5 && (
                <div ref={step5Ref} className={\`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 \${formActiveStep === 5 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}\`}>`);

code = code.replace(/<span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-\[12px\] font-bold">4<\/span>/g, `<span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[12px] font-bold">5</span>`);

code = code.replace(/\{formActiveStep > 4 \? <Check className="w-3 h-3" strokeWidth=\{3\} \/> : '3'\}/g, `{formActiveStep > 4 ? <Check className="w-3 h-3" strokeWidth={3} /> : '4'}`);

code = code.replace(/\{\/\* Step 3: 拆包要求 \*\/\}/g, `{/* Step 4: 拆包要求 */}`);

const newStep3 = `
              {/* Step 3: 控制重量/体积 */}
              {formActiveStep >= 3 && (
                <div ref={step3Ref} className={\`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 \${formActiveStep === 3 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}\`}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={\`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold \${formActiveStep > 3 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}\`}>
                        {formActiveStep > 3 ? <Check className="w-3 h-3" strokeWidth={3} /> : '3'}
                      </span>
                      <h2 className="font-bold text-[14px] text-gray-800">控制重量/体积</h2>
                    </div>
                    {formActiveStep > 3 && (
                      <button onClick={() => setFormActiveStep(3)} className="text-blue-500 text-[12px] flex items-center gap-1 hover:underline">
                        <Edit2 className="w-3 h-3" /> 修改
                      </button>
                    )}
                  </div>
                  
                  {formActiveStep === 3 ? (
                    <div className="p-3">
                      <div className="space-y-3">
                        {[
                          { id: 'no_control', title: '不控制，我要全发', desc: '包裹内所有物品全部发出。' },
                          { id: 'auto_remove', title: '控制到最近的档位（随机取出）', desc: '若满足不了，随机取出1-2单。' },
                          { id: 'specify_remove', title: '控制到最近的档位（指定取出）', desc: '若满足不了，指定取出一个订单（付费服务）。' }
                        ].map(opt => {
                          const isSelected = weightControlOption === opt.id;
                          return (
                            <div 
                              key={opt.id}
                              onClick={() => setWeightControlOption(opt.id)}
                              className={\`p-3 rounded-lg border-2 cursor-pointer transition-all \${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}\`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={\`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center \${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}\`}>
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                                </div>
                                <div className="flex-1">
                                  <div className={\`font-bold text-[14px] \${isSelected ? 'text-blue-900' : 'text-gray-800'}\`}>
                                    {opt.title}
                                  </div>
                                  <div className="text-[12px] text-gray-500 mt-1">
                                    {opt.desc}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {weightControlOption === 'specify_remove' && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <div className="text-[13px] text-blue-800 mb-2 font-medium">请选择要指定取出的订单（仅限1个）：</div>
                          {specifiedRemoveOrder ? (
                            <div className="flex items-center justify-between bg-white border border-blue-200 p-2 rounded">
                              <span className="text-[13px] font-bold text-gray-800">入库编号: {specifiedRemoveOrder}</span>
                              <button onClick={() => setShowOrderSelectModal(true)} className="text-blue-600 text-[12px] hover:underline">更换</button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setShowOrderSelectModal(true)}
                              className="w-full py-2 bg-white border border-blue-300 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 transition-colors"
                            >
                              + 点击选择订单
                            </button>
                          )}
                          <div className="mt-3 text-[12px] text-red-600 leading-relaxed">
                            <span className="font-bold">提示：</span>哪怕指定取出后，还是无法控制重量或体积，但是因为人工费已经产生，所以只能取出后封箱，跳档也没办法。
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => setFormActiveStep(4)}
                          className="bg-[#ffd200] text-gray-900 px-6 py-2 rounded-full text-[14px] font-bold active:scale-95 transition-transform"
                        >
                          确认重量要求，下一步
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="text-[13px] text-gray-500">已选要求</div>
                      <div className="font-medium text-[14px] text-gray-900 mt-1">
                        {weightControlOption === 'no_control' ? '不控制' : weightControlOption === 'auto_remove' ? '随机取出' : \`指定取出 \${specifiedRemoveOrder ? '[' + specifiedRemoveOrder + ']' : ''}\`}
                      </div>
                    </div>
                  )}
                </div>
              )}
`;

code = code.replace(/\{\/\* Step 4: 拆包要求 \*\/\}/g, newStep3 + '\n              {/* Step 4: 拆包要求 */}');

fs.writeFileSync('src/components/Flow20260708.tsx', code);
console.log('Fixed steps');
