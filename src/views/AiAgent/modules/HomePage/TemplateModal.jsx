import React, { useState } from 'react';
import { 
  X, ChevronLeft, Download, LayoutGrid, LayoutTemplate, 
  ShoppingBag, Users, Calendar, FileText, CreditCard, Box, Eye, BarChart3,
  GraduationCap, School, Wallet, BookOpen, DollarSign, Search, Bell
} from 'lucide-react';
import { categories, templates } from './mockData';
import './styles.css';

// Component mapping for dynamic icon rendering
const iconMap = {
  ShoppingBag: ShoppingBag,
  LayoutDashboard: LayoutTemplate,
  Users: Users,
  Calendar: Calendar,
  FileText: FileText,
  CreditCard: CreditCard,
  GraduationCap: GraduationCap,
  School: School
};

// --- MOCK THUMBNAIL (Mini UI Preview) ---
const MockThumbnail = ({ type, gradient, isLarge = false }) => {
  const commonStyle = {
    position: 'absolute',
    inset: isLarge ? '0' : '16px',
    background: 'rgba(255,255,255,0.98)',
    borderRadius: isLarge ? '12px' : '8px',
    boxShadow: isLarge ? 'none' : '0 10px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: isLarge ? '16px' : '8px',
    gap: isLarge ? '16px' : '8px',
    border: isLarge ? 'none' : '1px solid rgba(0,0,0,0.05)',
    zIndex: 2
  };

  const barStyle = (color, width) => ({
    height: isLarge ? '12px' : '8px',
    width: width || '40%',
    background: color || '#e2e8f0',
    borderRadius: '4px'
  });

  const renderContent = () => {
     // 1. E-COMMERCE / ANALYTICS
     if (type === 'ecommerce' || type === 'analytics' || type === 'saas') return (
         <>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={barStyle('#3b82f6', '35%')}></div>
                <div style={{display: 'flex', gap: '4px'}}>
                   <div style={{width: isLarge ? '24px' : '16px', height: isLarge ? '24px' : '16px', borderRadius: '50%', background: '#dcfce7'}}></div>
                   <div style={{width: isLarge ? '24px' : '16px', height: isLarge ? '24px' : '16px', borderRadius: '50%', background: '#fef9c3'}}></div>
                </div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '4px'}}>
                {[
                  {val: '$45k', col: '#3b82f6'},
                  {val: '1.2k', col: '#10b981'},
                  {val: '+12%', col: '#f59e0b'}
                ].map((s, i) => (
                    <div key={i} style={{
                      height: isLarge ? '60px' : '35px', 
                      background: 'white', 
                      border: '1px solid #f1f5f9',
                      borderRadius: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '4px 8px'
                    }}>
                       <div style={{height: '4px', width: '60%', background: '#f1f5f9', marginBottom: '4px'}}></div>
                       <div style={{fontSize: isLarge ? '1rem' : '0.7rem', fontWeight: '700', color: s.col}}>{s.val}</div>
                    </div>
                ))}
            </div>
            <div style={{flex: 1, display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '4px'}}>
                <div style={{background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', padding: '8px', position: 'relative'}}>
                   <div style={{position: 'absolute', bottom: '8px', left: '8px', right: '8px', height: '10px', background: '#dbeafe', borderRadius: '4px'}}></div>
                   <div style={{position: 'absolute', bottom: '22px', left: '30px', right: '30px', height: '14px', background: '#3b82f6', borderRadius: '4px'}}></div>
                </div>
            </div>
         </>
     );

     // 2. FINANCIAL
     if (type === 'financial') return (
         <>
            <div style={barStyle('#10b981', '40%')}></div>
            <div style={{
              height: isLarge ? '120px' : '50px', 
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
              borderRadius: '10px',
              padding: '12px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
               <div style={{fontSize: isLarge ? '1.2rem' : '0.8rem', fontWeight: '600'}}>$124,500</div>
               <div style={{fontSize: isLarge ? '0.7rem' : '0.5rem', opacity: 0.6}}>**** 4821</div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px'}}>
               {[1,2].map(i => (
                 <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '6px', background: '#f8fafc', borderRadius: '6px'}}>
                    <div style={{width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0'}}></div>
                    <div style={{flex: 1, margin: '0 8px', height: '8px', background: '#f1f5f9', alignSelf: 'center'}}></div>
                    <div style={{width: '30px', height: '8px', background: i===1?'#10b981':'#ef4444', alignSelf: 'center'}}></div>
                 </div>
               ))}
            </div>
         </>
     );

     // 3. CALENDAR / EDUCATION
     if (type === 'calendar' || type === 'education' || type === 'schools' || type === 'booking') return (
         <>
             <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center'}}>
                 <div style={barStyle('#a259ff', '30%')}></div>
                 <div style={{fontSize: isLarge ? '0.8rem' : '0.6rem', color: '#94a3b8'}}>October 2026</div>
             </div>
             <div style={{
                 display: 'grid', 
                 gridTemplateColumns: 'repeat(7, 1fr)', 
                 gridTemplateRows: 'repeat(4, 1fr)',
                 gap: '4px', 
                 flex: 1,
                 background: '#f8fafc',
                 padding: '4px',
                 borderRadius: '8px',
                 border: '1px solid #f1f5f9'
             }}>
                 {[...Array(28)].map((_, i) => (
                     <div key={i} style={{
                         background: (i === 4 || i === 12 || i === 20) ? (i===4?'#dbeafe':i===12?'#dcfce7':'#fef9c3') : 'white', 
                         borderRadius: '2px',
                         height: '100%'
                     }}></div>
                 ))}
             </div>
         </>
     );

     // 4. CMS / FEED
     if (type === 'cms' || type === 'feed') return (
        <>
             <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={barStyle('#f59e0b', '35%')}></div>
                <div style={{width: '16px', height: '16px', background: '#3b82f6', borderRadius: '4px'}}></div>
             </div>
             {[1,2,3].map(i => (
                 <div key={i} style={{display: 'flex', gap: '8px', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid #f1f5f9'}}>
                     <div style={{width: isLarge ? '40px' : '20px', height: isLarge ? '40px' : '20px', borderRadius: '6px', background: '#cbd5e1'}}></div>
                     <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center'}}>
                         <div style={{height: '6px', width: '80%', background: '#e2e8f0', borderRadius: '2px'}}></div>
                         <div style={{height: '6px', width: '40%', background: '#f1f5f9', borderRadius: '2px'}}></div>
                     </div>
                 </div>
             ))}
        </>
     );

     // 5. KANBAN / PROJECT
     if (type === 'kanban' || type === 'crm' || type === 'project') return (
         <>
             <div style={barStyle('#6366f1', '30%')}></div>
             <div style={{display: 'flex', gap: '8px', height: '100%', overflow: 'hidden'}}>
                 {['To Do', 'In Progress', 'Done'].map((label, i) => (
                     <div key={i} style={{flex: 1, background: '#f8fafc', borderRadius: '8px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid #f1f5f9'}}>
                         <div style={{fontSize: '0.5rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700'}}>{label}</div>
                         {[1,2].map(j => (
                            <div key={j} style={{
                              padding: '6px', 
                              background: 'white', 
                              borderRadius: '4px', 
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                              borderLeft: `2px solid ${i===0?'#94a3b8':i===1?'#f59e0b':'#10b981'}`
                            }}>
                               <div style={{height: '4px', width: '80%', background: '#f1f5f9'}}></div>
                            </div>
                         ))}
                     </div>
                 ))}
             </div>
         </>
     );
     
     // Default Generic
     return (
         <>
            <div style={barStyle('#3b82f6', '40%')}></div>
            <div style={{flex: 1, background: '#f8fafc', borderRadius: '8px', marginTop: '4px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
               <div style={{width: '30px', height: '30px', borderRadius: '50%', background: '#e2e8f0'}}></div>
            </div>
         </>
     );
  };

  return (
    <div style={{width: '100%', height: '100%', position: 'relative', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {/* Background Decorative Circles */}
        <div style={{position: 'absolute', top: '-20%', left: '-10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', filter: 'blur(20px)'}}></div>
        <div style={{position: 'absolute', bottom: '-20%', right: '-10%', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(30px)'}}></div>
        
        <div style={commonStyle}>
             {/* Main Layout Wrapper */}
             <div style={{display: 'flex', height: '100%', gap: isLarge ? '16px' : '8px'}}>
                 {/* Sidebar */}
                 <div style={{width: isLarge ? '60px' : '24px', height: '100%', background: '#f8fafc', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px', padding: isLarge ? '12px 8px' : '4px'}}>
                     <div style={{width: isLarge ? '24px' : '16px', height: isLarge ? '24px' : '16px', background: '#3b82f6', borderRadius: '4px', marginBottom: '8px'}}></div>
                     {[1,2,3,4,5].map(i => (
                         <div key={i} style={{width: '100%', height: isLarge ? '6px' : '3px', background: i===1?'#cbd5e1':'#f1f5f9', borderRadius: '2px'}}></div>
                     ))}
                 </div>
                 {/* Body */}
                 <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: isLarge ? '12px' : '6px'}}>
                      {renderContent()}
                 </div>
             </div>
        </div>
    </div>
  );
};

const TemplateModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0); // 0: Categories, 1: list, 2: detail
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showDemo, setShowDemo] = useState(false); // New state for live demo

  if (!isOpen) return null;

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
    setStep(1);
  };

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setStep(2);
    setShowDemo(false); // Reset demo state
  };

  const handleBack = () => {
    if (showDemo) {
        setShowDemo(false);
    } else if (step === 2) {
      setStep(1);
      setSelectedTemplate(null);
    } else if (step === 1) {
      setStep(0);
      setSelectedCategoryId(null);
    }
  };

  const currentTemplates = templates.filter(t => t.categoryId === selectedCategoryId);
  const currentCategory = categories.find(c => c.id === selectedCategoryId);

  // --- DYNAMIC MOCK DEMO COMPONENT ---
  const MockAdminDemo = ({ template }) => {
    const type = template.demoType || 'ecommerce'; 

    const renderEcommerce = () => (
      <div className="mock-main">
        <div className="mock-section-header">
            <h2 className="mock-section-title">Dashboard Overview</h2>
            <div style={{display: 'flex', gap: '8px'}}>
                 <span className="mock-btn-sm">This Week</span>
                 <span className="mock-btn-sm" style={{background:'#3b82f6', color:'white'}}>Export</span>
            </div>
        </div>
        
        <div className="mock-dashboard-grid">
            <div className="mock-card">
                <span style={{fontSize:'0.8rem', color:'#64748b'}}>Total Revenue</span>
                <span style={{fontSize:'1.5rem', fontWeight:'600', marginTop:'4px'}}>$45,231</span>
                <span className="mock-badge green" style={{width:'fit-content', marginTop:'8px'}}>+12.5%</span>
            </div>
             <div className="mock-card">
                <span style={{fontSize:'0.8rem', color:'#64748b'}}>Total Orders</span>
                <span style={{fontSize:'1.5rem', fontWeight:'600', marginTop:'4px'}}>1,205</span>
                <span className="mock-badge blue" style={{width:'fit-content', marginTop:'8px'}}>+5.2%</span>
            </div>
             <div className="mock-card">
                <span style={{fontSize:'0.8rem', color:'#64748b'}}>Avg. Order Value</span>
                <span style={{fontSize:'1.5rem', fontWeight:'600', marginTop:'4px'}}>$84.00</span>
                <span className="mock-badge orange" style={{width:'fit-content', marginTop:'8px'}}>-1.4%</span>
            </div>
        </div>

        <div className="mock-dashboard-grid-2">
            <div className="mock-card" style={{height: '240px', justifyContent:'center', alignItems:'center', background:'#f8fafc', border:'1px solid #e2e8f0'}}>
                <div style={{width:'100%', height:'100%', display:'flex', alignItems:'flex-end', gap:'8px', padding:'20px'}}>
                    {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                        <div key={i} style={{flex:1, height:`${h}%`, background: i === 3 ? '#3b82f6' : '#e2e8f0', borderRadius:'4px 4px 0 0'}}></div>
                    ))}
                </div>
            </div>
            <div className="mock-card">
                <h4 style={{fontSize:'0.9rem', marginBottom:'12px', fontWeight:'600'}}>Top Products</h4>
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', fontSize:'0.85rem'}}>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        <div style={{width:'32px', height:'32px', background:'#f1f5f9', borderRadius:'4px'}}></div>
                        <span>Nike Air Jordan</span>
                    </div>
                    <span style={{fontWeight:'600'}}>$12k</span>
                 </div>
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', fontSize:'0.85rem'}}>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        <div style={{width:'32px', height:'32px', background:'#f1f5f9', borderRadius:'4px'}}></div>
                        <span>Adidas Ultraboost</span>
                    </div>
                    <span style={{fontWeight:'600'}}>$8.5k</span>
                 </div>
                 <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem'}}>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        <div style={{width:'32px', height:'32px', background:'#f1f5f9', borderRadius:'4px'}}></div>
                        <span>Puma Suede</span>
                    </div>
                    <span style={{fontWeight:'600'}}>$4.2k</span>
                 </div>
            </div>
        </div>
      </div>
    );

    const renderFinancial = () => (
      <div className="mock-main">
         <div className="mock-section-header">
            <h2 className="mock-section-title">Financial Overview</h2>
            <button className="mock-btn-sm" style={{background:'#22c55e', color:'white'}}>+ New Transaction</button>
        </div>

        <div className="mock-dashboard-grid">
             <div className="mock-card" style={{background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color:'white'}}>
                <span style={{fontSize:'0.8rem', opacity:0.8}}>Total Balance</span>
                <span style={{fontSize:'1.8rem', fontWeight:'600', marginTop:'4px'}}>$124,500.00</span>
                <div style={{marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                   <span style={{fontSize:'0.8rem', opacity:0.6}}>**** 4821</span>
                   <div style={{width:'40px', height:'24px', background:'rgba(255,255,255,0.1)', borderRadius:'4px'}}></div>
                </div>
            </div>
            <div className="mock-card">
                <span style={{fontSize:'0.8rem', color:'#64748b'}}>Monthly Income</span>
                <span style={{fontSize:'1.5rem', fontWeight:'600', marginTop:'4px', color:'#22c55e'}}>$32,400</span>
                <div style={{marginTop:'8px', fontSize:'0.75rem', color:'#10b981'}}>↑ 12% vs last month</div>
            </div>
            <div className="mock-card">
                <span style={{fontSize:'0.8rem', color:'#64748b'}}>Monthly Expenses</span>
                <span style={{fontSize:'1.5rem', fontWeight:'600', marginTop:'4px', color:'#ef4444'}}>$8,230</span>
                <div style={{marginTop:'8px', fontSize:'0.75rem', color:'#ef4444'}}>↓ 5% vs last month</div>
            </div>
        </div>

        <div className="mock-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
               <h3 className="mock-section-title" style={{fontSize:'1rem', margin:0}}>Recent Transactions</h3>
               <span style={{fontSize:'0.8rem', color:'#3b82f6', fontWeight:'600'}}>View All</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f1f5f9'}}>
                <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                    <div style={{width:'40px', height:'40px', background:'#dcfce7', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#166534'}}>
                        <DollarSign size={20} />
                    </div>
                    <div style={{display:'flex', flexDirection:'column'}}>
                        <span style={{fontSize:'0.9rem', fontWeight:'600'}}>Stripe Settlement</span>
                        <span style={{fontSize:'0.75rem', color:'#64748b'}}>Today, 9:41 AM</span>
                    </div>
                </div>
                <div style={{textAlign:'right'}}>
                    <span style={{fontWeight:'700', color:'#22c55e', display:'block'}}>+$1,420.00</span>
                    <span style={{fontSize:'0.7rem', color:'#94a3b8'}}>Completed</span>
                </div>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f1f5f9'}}>
                <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                    <div style={{width:'40px', height:'40px', background:'#fee2e2', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#991b1b'}}>
                        <Box size={20} />
                    </div>
                    <div style={{display:'flex', flexDirection:'column'}}>
                        <span style={{fontSize:'0.9rem', fontWeight:'600'}}>AWS Infrastructure</span>
                        <span style={{fontSize:'0.75rem', color:'#64748b'}}>Yesterday, 4:20 PM</span>
                    </div>
                </div>
                <div style={{textAlign:'right'}}>
                    <span style={{fontWeight:'700', color:'#1e293b', display:'block'}}>-$240.50</span>
                    <span style={{fontSize:'0.7rem', color:'#94a3b8'}}>Pending</span>
                </div>
            </div>
        </div>
      </div>
    );

    const renderCalendar = () => (
      <div className="mock-main">
         <div className="mock-section-header">
            <h2 className="mock-section-title">{type === 'schools' ? 'Academic Schedule' : 'Calendar'}</h2>
            <div style={{display: 'flex', gap: '8px'}}>
                 <span className="mock-btn-sm">Week</span>
                 <span className="mock-btn-sm" style={{background:'#3b82f6', color:'white'}}>Month</span>
                 <span className="mock-btn-sm">Year</span>
            </div>
        </div>

        <div className="mock-calendar-wrapper" style={{background:'white', borderRadius:'12px', padding:'20px', border:'1px solid #e2e8f0'}}>
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h3 style={{margin:0, fontSize:'1.1rem'}}>October 2026</h3>
                <div style={{display:'flex', gap:'8px'}}>
                    <button style={{width:'32px', height:'32px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white'}}>‹</button>
                    <button style={{width:'32px', height:'32px', borderRadius:'6px', border:'1px solid #e2e8f0', background:'white'}}>›</button>
                </div>
             </div>
             <div className="mock-calendar-grid" style={{background:'none', border:'none', gap:'8px'}}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} style={{textAlign:'center', fontSize:'0.75rem', color:'#94a3b8', paddingBottom:'10px', fontWeight:'600'}}>{day}</div>
                ))}
                {[...Array(31)].map((_, i) => (
                    <div className="mock-cal-day" key={i} style={{minHeight:'80px', background:'#f8fafc', border:'none', borderRadius:'8px', padding:'8px'}}>
                        <span style={{fontWeight:'600', fontSize:'0.8rem'}}>{i + 1}</span>
                        {i === 2 && <div className="mock-cal-event blue" style={{fontSize:'0.65rem', padding:'4px', borderRadius:'4px', marginTop:'4px'}}>Math 101</div>}
                        {i === 12 && <div className="mock-cal-event green" style={{fontSize:'0.65rem', padding:'4px', borderRadius:'4px', marginTop:'4px'}}>Science Lab</div>}
                        {i === 20 && <div className="mock-cal-event purple" style={{fontSize:'0.65rem', padding:'4px', borderRadius:'4px', marginTop:'4px'}}>History Exam</div>}
                    </div>
                ))}
             </div>
        </div>
      </div>
    );

    const renderFeed = () => (
      <div className="mock-main">
         <div className="mock-section-header">
            <h2 className="mock-section-title">Content Workspace</h2>
            <button className="mock-btn-sm" style={{background:'#3b82f6', color:'white', display:'flex', alignItems:'center', gap:'6px'}}>
                <FileText size={14} /> New Post
            </button>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'2rem'}}>
            <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
               <div className="mock-feed-post" style={{padding:'24px'}}>
                   <div style={{display:'flex', gap:'16px'}}>
                        <div className="mock-avatar" style={{width:'48px', height:'48px'}}></div>
                        <div className="mock-post-content">
                            <div className="mock-post-title" style={{fontSize:'1.1rem'}}>Product Updates: September 2026</div>
                            <div className="mock-post-meta">Published by <b>Sarah Jones</b> • 2 hours ago</div>
                            <p style={{fontSize:'0.9rem', color:'#475569', lineHeight:'1.5', margin:'12px 0'}}>
                                Our biggest update yet is here! We`&#39;`ve completely redesigned the core engine to be 3x faster...
                            </p>
                            <div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
                                <span className="mock-badge green">Published</span>
                                <span className="mock-badge blue">Announcement</span>
                            </div>
                        </div>
                   </div>
               </div>

                <div className="mock-feed-post" style={{padding:'24px'}}>
                   <div style={{display:'flex', gap:'16px'}}>
                        <div className="mock-avatar" style={{width:'48px', height:'48px', background: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)'}}></div>
                        <div className="mock-post-content">
                            <div className="mock-post-title" style={{fontSize:'1.1rem'}}>Draft: User Onboarding Flow</div>
                            <div className="mock-post-meta">Draft by <b>Mike Chen</b> • 5 hours ago</div>
                            <p style={{fontSize:'0.9rem', color:'#475569', lineHeight:'1.5', margin:'12px 0'}}>
                                Looking for feedback on the new onboarding steps. Specifically Step 3 which involves...
                            </p>
                            <div style={{display:'flex', gap:'8px', marginTop:'12px'}}>
                                <span className="mock-badge orange">Draft</span>
                                <span className="mock-badge blue">Product</span>
                            </div>
                        </div>
                   </div>
               </div>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
                <div className="mock-card">
                    <h4 style={{margin:0, marginBottom:'1rem', fontSize:'0.9rem'}}>Analytics Summary</h4>
                    <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                        <div>
                            <span style={{fontSize:'0.75rem', color:'#64748b'}}>Total Views</span>
                            <div style={{fontWeight:'700', fontSize:'1.2rem'}}>12.5k</div>
                        </div>
                        <div>
                            <span style={{fontSize:'0.75rem', color:'#64748b'}}>Engagement</span>
                            <div style={{fontWeight:'700', fontSize:'1.2rem'}}>8.4%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );

    const renderKanban = () => (
      <div className="mock-main">
         <div className="mock-section-header">
            <h2 className="mock-section-title">Sprint 14: Q3 Planning</h2>
             <div style={{display: 'flex', gap: '8px', alignItems:'center'}}>
                 <div style={{display:'flex', marginRight:'12px'}}>
                     {[1,2,3].map(i => (
                         <div className="mock-avatar" key={i} style={{width:'32px', height:'32px', border:'2px solid white', marginLeft: i===1?0:'-12px', background: i===2?'#fca5a5':undefined}}></div>
                     ))}
                 </div>
                 <button className="mock-btn-sm" style={{background:'#3b82f6', color:'white'}}>+ Add Task</button>
            </div>
        </div>

        <div className="mock-kanban-board" style={{gap:'1.5rem'}}>
            <div className="mock-kanban-col" style={{background:'#f1f5f9', borderRadius:'12px', padding:'12px', width:'300px'}}>
                <div className="mock-kanban-header badge" style={{background:'none', padding:0, marginBottom:'1rem'}}>
                    <span style={{fontWeight:'700', fontSize:'0.9rem', color:'#475569'}}>BACKLOG</span>
                    <span style={{background:'#e2e8f0', padding:'2px 8px', borderRadius:'10px', fontSize:'0.75rem'}}>3</span>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                    <div className="mock-kanban-card" style={{padding:'16px', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
                        <div style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'8px'}}>Market Research</div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <span className="mock-badge blue" style={{fontSize:'0.65rem'}}>Discovery</span>
                            <div className="mock-avatar" style={{width:'20px', height:'20px'}}></div>
                        </div>
                    </div>
                    <div className="mock-kanban-card" style={{padding:'16px', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
                         <div style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'8px'}}>Draft Initial API</div>
                         <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <span className="mock-badge orange" style={{fontSize:'0.65rem'}}>Technical</span>
                            <div className="mock-avatar" style={{width:'20px', height:'20px'}}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mock-kanban-col" style={{background:'#f1f5f9', borderRadius:'12px', padding:'12px', width:'300px'}}>
                <div className="mock-kanban-header badge" style={{background:'none', padding:0, marginBottom:'1rem'}}>
                    <span style={{fontWeight:'700', fontSize:'0.9rem', color:'#475569'}}>IN PROGRESS</span>
                    <span style={{background:'#fef3c7', color:'#92400e', padding:'2px 8px', borderRadius:'10px', fontSize:'0.75rem'}}>2</span>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                    <div className="mock-kanban-card" style={{padding:'16px', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)', borderLeft:'4px solid #f59e0b'}}>
                        <div style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'8px'}}>Auth Integration</div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <span className="mock-badge blue" style={{fontSize:'0.65rem'}}>Sprint</span>
                            <div className="mock-avatar" style={{width:'20px', height:'20px'}}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mock-kanban-col" style={{background:'#f1f5f9', borderRadius:'12px', padding:'12px', width:'300px'}}>
                <div className="mock-kanban-header badge" style={{background:'none', padding:0, marginBottom:'1rem'}}>
                    <span style={{fontWeight:'700', fontSize:'0.9rem', color:'#475569'}}>COMPLETED</span>
                    <span style={{background:'#dcfce7', color:'#166534', padding:'2px 8px', borderRadius:'10px', fontSize:'0.75rem'}}>5</span>
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                    <div className="mock-kanban-card" style={{padding:'16px', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)', borderLeft:'4px solid #22c55e'}}>
                        <div style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'8px', textDecoration:'line-through', color:'#94a3b8'}}>Setup Repo</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );

    const renderSidebar = () => {
      const items = {
        'ecommerce': [
          { icon: LayoutTemplate, label: 'Dashboard', active: true },
          { icon: ShoppingBag, label: 'Orders' },
          { icon: Box, label: 'Products' },
          { icon: Users, label: 'Customers' }
        ],
        'financial': [
          { icon: LayoutTemplate, label: 'Overview', active: true },
          { icon: Wallet, label: 'Transactions' },
          { icon: CreditCard, label: 'Cards' },
          { icon: FileText, label: 'Reports' }
        ],
        'education': [
          { icon: LayoutTemplate, label: 'Dashboard', active: true },
          { icon: BookOpen, label: 'Courses' },
          { icon: Users, label: 'Students' },
          { icon: Calendar, label: 'Schedule' }
        ],
        'cms': [
          { icon: LayoutTemplate, label: 'Content', active: true },
          { icon: FileText, label: 'Posts' },
          { icon: Users, label: 'Authors' },
          { icon: BarChart3, label: 'Analytics' }
        ],
        'kanban': [
          { icon: LayoutTemplate, label: 'Board', active: true },
          { icon: FileText, label: 'Backlog' },
          { icon: Users, label: 'Team' },
          { icon: BarChart3, label: 'Reports' }
        ]
      };

      const menu = items[type] || items['ecommerce'];

      return menu.map((item, idx) => (
        <div className={`mock-nav-item ${item.active ? 'active' : ''}`} key={idx}>
          <item.icon size={16} /> {item.label}
        </div>
      ));
    };

    return (
      <div className="mock-browser-window" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        {/* Browser Header */}
        <div className="mock-browser-header" style={{ padding: '0 1.5rem', height: '50px' }}>
          <div style={{ display: 'flex', gap: '6px', marginRight: '1rem' }}>
            <div className="mock-dot red"></div>
            <div className="mock-dot yellow"></div>
            <div className="mock-dot green"></div>
          </div>
          <div className="mock-address-bar" style={{ flex: 1, maxWidth: '600px', fontSize: '0.8rem', color: '#94a3b8' }}>
            <Box size={14} style={{ marginRight: '8px', color: '#3b82f6' }} />
            app.ucode.ai/{template.categoryId}/{template.id}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', color: '#64748b' }}>
            <div style={{ width: '28px', height: '28px', background: '#e2e8f0', borderRadius: '50%' }}></div>
          </div>
        </div>

        <div className="mock-body">
          {/* Dynamic Sidebar */}
          <div className="mock-sidebar" style={{ width: '240px', background: '#1e293b', borderRight: '1px solid #334155' }}>
            <div className="mock-logo" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box size={20} color="white" />
              </div>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '1rem' }}>UCODE</span>
            </div>
            <div style={{ padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {renderSidebar()}
            </div>

            <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: '500' }}>Admin User</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Pro Plan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Main Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' }}>
            {/* Top Top Bar inside body */}
            <div style={{ height: '64px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 2rem', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '8px 16px', borderRadius: '8px', width: '300px', gap: '10px' }}>
                <Search size={16} color="#94a3b8" />
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Search everything...</span>
              </div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Bell size={20} color="#64748b" />
                  <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></div>
                </div>
                <button style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '0.85rem' }}>
                  Create New
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              {type === 'ecommerce' && renderEcommerce()}
              {type === 'analytics' && renderEcommerce()}
              {type === 'financial' && renderFinancial()}
              {type === 'education' && renderCalendar()}
              {type === 'calendar' && renderCalendar()}
              {type === 'schools' && renderCalendar()}
              {type === 'cms' && renderFeed()}
              {(type === 'kanban' || type === 'crm') && renderKanban()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="flex-center" style={{ gap: '1rem' }}>
            {(step > 0 || showDemo) && (
              <button className="back-btn" onClick={handleBack}>
                <ChevronLeft size={20} />
                Back
              </button>
            )}
            <h2 className="modal-title">
              {showDemo && `Preview: ${selectedTemplate.title}`}
              {!showDemo && step === 0 && 'Explore Categories'}
              {!showDemo && step === 1 && `${currentCategory?.name || 'Category'} Templates`}
              {!showDemo && step === 2 && 'Template Details'}
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: showDemo ? '0' : '3rem', background: showDemo ? '#0f172a' : undefined }}>
          
          {/* Step 0: Categories (Mini Template Look) */}
          {step === 0 && (
            <div className="categories-grid">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || LayoutGrid; 
                return (
                  <div 
                    key={cat.id} 
                    className="category-card"
                    onClick={() => handleCategoryClick(cat.id)}
                    style={{
                      '--cat-color': cat.color,
                      '--cat-gradient': cat.gradient
                    }}
                  >
                    {/* Header with Large Icon */}
                    <div className="category-header">
                        <Icon className="category-icon" />
                    </div>
                    
                    {/* Body Info */}
                    <div className="category-info">
                        <span className="category-name">{cat.name}</span>
                        <span className="category-count">{cat.count} templates</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 1: Templates List */}
          {step === 1 && (
            <div className="templates-list">
              {currentTemplates.length > 0 ? (
                currentTemplates.map((template) => (
                  <div 
                    key={template.id} 
                    className="template-card"
                    onClick={() => handleTemplateClick(template)}
                  >
                    <div className="template-thumbnail">
                        <MockThumbnail type={template.demoType} gradient={template.thumbnail} />
                    </div>
                    <div className="template-info">
                      <h3 className="template-title">{template.title}</h3>
                      <p className="template-desc">{template.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8', gridColumn: '1/-1', padding: '2rem' }}>
                  No templates found in this category yet.
                </div>
              )}
            </div>
          )}

          {/* Step 2: Detail View */}
          {!showDemo && step === 2 && selectedTemplate && (
            <div className="template-detail">
              <div className="detail-preview" style={{ overflow: 'hidden', position: 'relative' }}>
                <MockThumbnail 
                  type={selectedTemplate.demoType} 
                  gradient={selectedTemplate.thumbnail} 
                  isLarge={true} 
                />
              </div>
              <div className="detail-content">
                <h2 className="detail-title">{selectedTemplate.title}</h2>
                <p className="detail-desc">{selectedTemplate.description}</p>
                
                <div className="detail-actions">
                  <button 
                    className="btn-outline flex-center" 
                    style={{ gap: '0.5rem' }}
                    onClick={() => setShowDemo(true)}
                  >
                    <Eye size={18} />
                    Preview Live Demo
                  </button>
                  <button 
                    className="btn-primary flex-center" 
                    style={{ gap: '0.5rem' }}
                    onClick={() => console.log('Importing template:', selectedTemplate.id)}
                  >
                    <Download size={18} />
                    Import Template
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Live Mock Demo */}
          {showDemo && selectedTemplate && (
            <div style={{ height: '100%', padding: '2rem' }}>
                <MockAdminDemo template={selectedTemplate} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
