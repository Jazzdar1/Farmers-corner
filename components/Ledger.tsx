
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, IndianRupee, Trash2, TrendingDown, LayoutGrid, Calendar, Wallet } from 'lucide-react';
import { ExpenseRecord, Language } from '../types';

interface LedgerProps {
  language: Language;
  onBack: () => void;
}

export const Ledger: React.FC<LedgerProps> = ({ language, onBack }) => {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('fc_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({ category: 'Spray', amount: '', note: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    localStorage.setItem('fc_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount) return;
    const newRecord: ExpenseRecord = {
      id: Date.now().toString(),
      category: form.category as any,
      amount: parseFloat(form.amount),
      date: form.date,
      note: form.note
    };
    setExpenses([newRecord, ...expenses]);
    setForm({ ...form, amount: '', note: '' });
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 font-bold hover:text-green-600">
          <ArrowLeft className="w-5 h-5" /> BACK TO TOOLS
        </button>
        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Orchard Expense Ledger</h2>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-12 no-scrollbar pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl md:col-span-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Expenditure</span>
                <p className="text-4xl font-black mt-2">₹{total.toLocaleString()}</p>
              </div>
              <Wallet className="w-12 h-12 opacity-20 self-end" />
            </div>

            <form onSubmit={addExpense} className="md:col-span-2 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold mt-1">
                  <option>Spray</option>
                  <option>Fertilizer</option>
                  <option>Labor</option>
                  <option>Transport</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Amount (₹)</label>
                <input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold mt-1" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Note / Product Name</label>
                <input value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="e.g. Score Spray 5 Litres" className="w-full p-4 rounded-2xl bg-slate-50 border-none font-bold mt-1" />
              </div>
              <button className="col-span-2 bg-green-600 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-xl shadow-green-900/10 active:scale-95 transition-all">Add Transaction</button>
            </form>
          </div>

          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 border-b flex items-center justify-between">
              <h3 className="font-black text-slate-900 flex items-center gap-2"><LayoutGrid className="text-green-600" /> Recent Entries</h3>
              <Calendar className="text-slate-300" />
            </div>
            <div className="divide-y divide-slate-50">
              {expenses.length === 0 ? (
                <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No entries found</div>
              ) : (
                expenses.map(exp => (
                  <div key={exp.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 uppercase">{exp.category[0]}</div>
                      <div>
                        <p className="font-black text-slate-900">{exp.note || exp.category}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{exp.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-black text-slate-900">₹{exp.amount}</span>
                      <button onClick={() => setExpenses(expenses.filter(i => i.id !== exp.id))} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
