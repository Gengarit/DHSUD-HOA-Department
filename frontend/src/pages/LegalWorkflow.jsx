import React from 'react';

function LegalWorkflow() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Legal Workflow</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Track the progression of legal actions (NOV → OTP → OIAS → MR)</p>
      </div>

      <div className="bg-[#242B3D] border border-[#3A4A62] rounded-lg p-8">
        <h2 className="text-lg font-semibold text-white mb-8">Legal Action Flow</h2>
        <div className="flex items-center justify-between">
          {[
            { name: 'NOV', desc: 'Notice of Violation' },
            { name: 'OTP', desc: 'Order of Termination' },
            { name: 'OIAS', desc: 'Order of Imposition' },
            { name: 'MR', desc: 'Motion for Reconsideration' }
          ].map((stage, idx) => (
            <div key={stage.name} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-bold text-lg">{stage.name}</div>
                <div className="text-[10px] text-[#9CA3AF] mt-2 text-center max-w-[100px]">{stage.desc}</div>
              </div>
              {idx < 3 && (
                <div className="flex-1 h-0.5 bg-[#3A4A62] mx-4"></div>
              )}
            </div>
          ))}
        </div>
        <p className="text-[#9CA3AF] text-sm mt-8 text-center">
          HOAs progress through these stages based on violations and administrative actions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { stage: 'NOV', color: 'orange', desc: 'Initial violation notice filed' },
          { stage: 'OTP', color: 'red', desc: 'Termination order issued' },
          { stage: 'OIAS', color: 'red', desc: 'Administrative sanction imposed' },
          { stage: 'MR', color: 'blue', desc: 'Appeal for reconsideration filed' }
        ].map((item) => (
          <div key={item.stage} className={`bg-${item.color}-900/10 border border-${item.color}-900/20 rounded-lg p-4`}>
            <div className={`font-semibold text-${item.color}-400 text-2xl mb-2`}>{item.stage}</div>
            <p className="text-[11px] text-[#9CA3AF]">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LegalWorkflow;
