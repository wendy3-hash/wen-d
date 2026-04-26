/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Hexagon, Crosshair, TerminalSquare, Image as ImageIcon, FileText, Play, Cat } from 'lucide-react';

// --- Particle Network Background ---
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    let mouse = { x: -1000, y: -1000 };

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number; baseColor: string;
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 2 + 1;
        this.baseColor = Math.random() > 0.5 ? '#00f3ff' : '#ff00ff';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Interaction with mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= dx * force * 0.05;
          this.y -= dy * force * 0.05;
        }
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.baseColor;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        
        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.2 - dist/600})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        
        // Connect to mouse to create "neon ripples / sparks"
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 150) {
           ctx.beginPath();
           ctx.strokeStyle = `rgba(255, 0, 255, ${0.5 - mdist/300})`;
           ctx.lineWidth = 2;
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(mouse.x, mouse.y);
           ctx.stroke();
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// --- Data ---
const PROJECTS = [
  {
    id: '01',
    category: '文学剧本',
    title: '纪录片《桑园围》第五集',
    role: '脚本与分镜主创',
    desc: '独立制作国家级重点选题脚本撰写。独立挖掘“桑基鱼塘”文化内核，通过专业视听语言精准还原世界水利遗产，展示了深厚的叙事逻辑与文化价值挖掘能力。',
    links: [
      { label: '由于保密原因，内容不予展示。因此本次不予展示。', icon: <FileText size={14} /> },
    ],
    tech: ['叙事逻辑', '视听规划', '文化透视']
  },
  {
    id: '02',
    category: '视觉美术',
    title: '影视短片《守望》',
    role: '美术导演 / 视觉把控',
    desc: '统筹全片视觉美学体系。独立负责场景美术规划、色彩基调及后期影调。在多部门协同下确保视听语言的高度统一，建立了一套高效的影视美术执行流程。',
    links: [
      { label: '守望展示 (提取码: vk68)', icon: <ImageIcon size={14} />, url: 'https://pan.baidu.com/s/1roFjFIkrhjdOJzPHKU3inQ?pwd=vk68' },
      { label: '成片 (提取码: maqb)', icon: <Play size={14} />, url: 'https://pan.baidu.com/s/1m9cZTQo3Jb07Fx0DdWIGYQ?pwd=maqb' },
    ],
    tech: ['美术执行', '场景概念', '色彩管理']
  },
  {
    id: '03',
    category: 'AIGC生成',
    title: 'AI短剧《炽热天使》',
    role: 'AIGC 全链路内容创作',
    desc: '参与AI短剧工业化生产。通过AIGC工具快速迭代脚本与视觉资产，实现分镜、角色及场景的快速闭环，全链路创作效率提升逾50%。',
    links: [
      { label: 'AI资产库 (提取码: isri)', icon: <ImageIcon size={14} />, url: 'https://pan.baidu.com/s/1haKWVIMD2ZcKZpjoYiTj-g?pwd=isri' },
      { label: '部分分镜脚本展示 (提取码: asqj)', icon: <FileText size={14} />, url: 'https://pan.baidu.com/s/1-EwaFuF6EvqjxklZarlg6A?pwd=asqj' },
    ],
    tech: ['文本生成', '图像生成', '角色一致性']
  },
  {
    id: '04',
    category: '视觉美术',
    title: '2026FILMART短片',
    role: '分镜设计与视觉概念',
    desc: '作为个人练习参与该电影节短片的分镜创作。在创作过程中深度体验了专业影视项目的视觉开发，积累了宝贵的叙事构思与分镜转化经验。',
    links: [
      { label: '分镜手稿 (提取码: rsgd)', icon: <FileText size={14} />, url: 'https://pan.baidu.com/s/14-65YdHu6gmdDFOOLQYzdQ?pwd=rsgd' },
    ],
    tech: ['分镜设计', '视觉开发', '叙事构思']
  },
];

const SKILLS = [
  { label: '文学创作基础', points: ['小说创作', '剧本撰写', '纪录片文案', '叙事逻辑'] },
  { label: '视听设计与审美', points: ['分镜设计', '镜头语言', '美学把控', '全流程规划'] },
  { label: 'AIGC 主流工具', points: ['Midjourney', '即梦', 'Nano Banana', 'DeepSeek', 'Liblib', 'Gemini'] },
];

const SOFTWARE_CATEGORIES = [
  {
    title: 'AIGC应用',
    icon: <Hexagon className="text-cyber-neon-purple w-8 h-8" />,
    colorClass: 'text-cyber-neon-purple',
    content: '精通Midjourney、Nano Banana、即梦、liblib、Gemini、豆包、DeepSeek、通义千问、文心一言等工具，熟悉文本生成、图像生成、分镜辅助、短剧资产与视频生成。'
  },
  {
    title: '综合工具',
    icon: <Zap className="text-cyber-neon-cyan w-8 h-8" />,
    colorClass: 'text-cyber-neon-cyan',
    content: '使用runninghub、稿定设计、海绵音乐、剪映、PS等，具备全链路内容制作能力。'
  }
];

// --- Components ---
const CyberButton = ({ children, active, onClick, pingColor = "bg-cyber-neon-cyan" }: any) => (
  <button 
    onClick={onClick}
    className={`relative group px-6 py-3 font-cyber text-sm tracking-widest cyber-clip-btn transition-all duration-300
      ${active ? 'bg-white/10 text-white' : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'}
    `}
  >
    {active && (
       <motion.div layoutId="nav-indicator" className="absolute inset-0 border border-cyber-neon-cyan cyber-clip-btn pointer-events-none shadow-[0_0_15px_rgba(0,243,255,0.3)] inset-shadow-sm" />
    )}
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${active ? pingColor : 'bg-white/20'} ${active && 'animate-pulse shadow-[0_0_8px_currentColor] text-cyber-neon-cyan'}`} />
      {children}
    </div>
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'works' | 'skills' | 'contact'>('works');
  const [activeFilter, setActiveFilter] = useState('ALL / 全部');
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const target = el.closest('button, a') as HTMLElement;
      
      if (target) {
        const x = e.clientX;
        const y = e.clientY;
        const newId = Date.now() + Math.random();
        
        const colors = ['text-cyber-neon-cyan', 'text-cyber-neon-pink', 'text-cyber-neon-purple'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        setCats(prev => [...prev, { id: newId, x, y, color }]);
        
        setTimeout(() => {
          setCats(prev => prev.filter(c => c.id !== newId));
        }, 2000);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);
  
  const filters = ['ALL / 全部', 'AIGC生成', '视觉美术', '文学剧本', '应用软件'];
  const filteredProjects = activeFilter === 'ALL / 全部' ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  // Switch sound simulation
  const handleFilterSwitch = (f: string) => {
     setActiveFilter(f);
     // Visual "explosion" pulse effect could be managed via framer-motion key triggers
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-white relative font-sans">
      <AnimatePresence>
        {cats.map(cat => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 1, scale: 0.5, x: cat.x, y: cat.y, rotate: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 2.4, 
              y: cat.y - 150, 
              rotate: Math.random() * 40 - 20 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`fixed z-[99999] pointer-events-none drop-shadow-[0_0_15px_currentColor] ${cat.color} flex flex-col items-center justify-center`}
            style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
          >
            <Cat size={38} className="drop-shadow-[0_0_8px_currentColor]" strokeWidth={1.5} />
          </motion.div>
        ))}
      </AnimatePresence>
      <ParticleBackground />

      {/* Floating Fluid Glass Blobs (Background) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-cyber-neon-purple rounded-full mix-blend-screen opacity-20 filter blur-[60px] animate-fluid-blob" />
         <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-cyber-neon-cyan rounded-full mix-blend-screen opacity-20 filter blur-[60px] animate-fluid-blob animation-delay-2000" />
         <div className="absolute bottom-[10%] left-[30%] w-[600px] h-[600px] bg-cyber-neon-pink rounded-full mix-blend-screen opacity-10 filter blur-[80px] animate-fluid-blob animation-delay-4000" />
         <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl z-0" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-12">
        {/* Header / Hero */}
        <header className="mb-20 pt-10 px-4 md:px-10 z-[100] relative">
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col items-start gap-4 group cursor-default"
           >
              <h1 
                 className="text-4xl md:text-7xl font-black tracking-tight glitch-text relative z-[100] select-none" 
                 data-text="艺术与科技 唐文玲"
              >
                 艺术与科技 唐文玲
              </h1>
              <p className="text-xl md:text-3xl font-cyber italic font-black liquid-metal-text tracking-widest mt-2 block relative z-[100] select-none">
                Welcome to Wendy's resume.
              </p>
           </motion.div>
        </header>

        {/* Main Content Grid */}
        <main className="flex-grow grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-8 md:gap-16 px-4 md:px-10 pb-40">
           
           {/* Sidebar: Dimensional Switcher */}
           <aside className="glass-cyber p-6 cyber-clip self-start xl:sticky xl:top-10 flex flex-col gap-6 relative z-[50]">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                 <Zap size={20} className="text-cyber-neon-pink" />
                 <h2 className="font-cyber tracking-widest text-sm text-cyber-neon-pink uppercase text-glow-pink">作品简历</h2>
              </div>
              <div className="flex flex-col gap-2 relative">
                 {filters.map(filter => (
                   <button 
                     key={filter}
                     onClick={() => handleFilterSwitch(filter)}
                     className={`text-left px-4 py-3 font-bold transition-all relative overflow-hidden group
                        ${activeFilter === filter ? 'text-cyber-neon-cyan text-glow-cyan pl-6' : 'text-white/40 hover:text-white/80 hover:pl-6'}
                     `}
                   >
                      {activeFilter === filter && (
                         <motion.div 
                           layoutId="active-filter" 
                           className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-cyber-neon-cyan shadow-[0_0_10px_#00f3ff]" 
                         />
                      )}
                      
                      {/* Pulse effect on active */}
                      {activeFilter === filter && (
                         <motion.div 
                           initial={{ scale: 0, opacity: 0.8 }}
                           animate={{ scale: 2, opacity: 0 }}
                           transition={{ duration: 0.5 }}
                           className="absolute inset-0 bg-cyber-neon-cyan/20 rounded-full w-4 h-4 my-auto pointer-events-none"
                         />
                      )}

                      {filter}
                   </button>
                 ))}
              </div>
           </aside>

           {/* Works Grid */}
           <div className="relative min-h-[500px] z-[50]">
                <div 
                   className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                   {activeTab === 'works' && activeFilter !== '应用软件' && filteredProjects.map(project => (
                     <motion.div 
                        key={project.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="glass-cyber p-8 cyber-border cyber-clip hover:bg-white/5 transition-all group"
                     >
                        <div className="flex justify-between items-start mb-6">
                           <span className="font-cyber text-[10px] text-cyber-neon-pink tracking-[4px] border border-cyber-neon-pink/30 px-2 py-1">
                             {project.id} // {project.category}
                           </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-cyber-neon-cyan transition-colors">{project.title}</h3>
                        <p className="text-xs font-cyber text-cyber-neon-cyan/80 mb-6">{project.role}</p>
                        
                        <p className="text-sm leading-relaxed text-white/70 mb-8">
                           {project.desc}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                           {project.tech.map(t => (
                              <span key={t} className="text-[10px] bg-cyber-dark px-2 py-1 font-cyber text-white/50 border border-white/5">{t}</span>
                           ))}
                        </div>

                        <div className="flex flex-wrap gap-3 mt-auto">
                           {project.links.map(link => (
                              link.url ? (
                                <a 
                                  href={link.url} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  key={link.label}
                                  className="flex items-center gap-2 text-[11px] font-bold tracking-wider px-4 py-2 bg-white/5 hover:bg-cyber-neon-cyan hover:text-black transition-all cyber-clip-btn"
                                >
                                  {link.icon} {link.label}
                                </a>
                              ) : (
                                <span 
                                  key={link.label}
                                  className="flex items-center gap-2 text-[11px] font-bold tracking-wider px-4 py-2 bg-white/5 text-white/50 cursor-not-allowed transition-all cyber-clip-btn"
                                >
                                  {link.icon} {link.label}
                                </span>
                              )
                           ))}
                        </div>
                     </motion.div>
                   ))}

                   {activeTab === 'works' && activeFilter === '应用软件' && (
                      <div className="col-span-full flex flex-col gap-8 w-full max-w-4xl mx-auto">
                         {SOFTWARE_CATEGORIES.map((category, i) => (
                            <motion.div 
                              key={category.title}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="glass-cyber p-10 cyber-border cyber-clip hover:bg-white/5 transition-all group relative overflow-hidden"
                            >
                               <div className="flex items-center gap-4 mb-6 relative z-10">
                                  {category.icon}
                                  <h3 className={`text-3xl font-black font-cyber tracking-widest uppercase ${category.colorClass}`}>
                                    {category.title}
                                  </h3>
                               </div>
                               <p className="text-xl text-white/90 leading-relaxed font-medium relative z-10">
                                 {category.content}
                               </p>
                            </motion.div>
                         ))}
                      </div>
                   )}

                   {activeTab === 'skills' && (
                      <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-8">
                         {SKILLS.map((skill, i) => (
                            <motion.div 
                              key={skill.label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="glass-cyber p-8 cyber-clip border-t-2 border-cyber-neon-cyan"
                            >
                               <Hexagon className="text-cyber-neon-cyan mb-4" />
                               <h3 className="text-xl font-bold mb-6 font-cyber">{skill.label}</h3>
                               <ul className="space-y-4">
                                  {skill.points.map(p => (
                                     <li key={p} className="flex items-center gap-3 text-sm text-white/70">
                                        <Crosshair size={12} className="text-cyber-neon-pink" />
                                        {p}
                                     </li>
                                  ))}
                               </ul>
                            </motion.div>
                         ))}
                      </div>
                   )}
                </div>
           </div>
        </main>

        {/* Global Floating Cyber Console (Nav) */}
        <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] glass-cyber px-2 py-2 cyber-clip flex gap-2 border-b-2 border-cyber-neon-pink shadow-[0_10px_40px_rgba(255,0,255,0.2)]">
           <CyberButton 
             active={activeTab === 'works'} 
             onClick={() => setActiveTab('works')}
             pingColor="bg-cyber-neon-cyan"
           >
             作品集。BOMB
           </CyberButton>
           <CyberButton 
             active={activeTab === 'skills'} 
             onClick={() => setActiveTab('skills')}
             pingColor="bg-cyber-neon-purple"
           >
             技能。MAX
           </CyberButton>
           <CyberButton 
             active={activeTab === 'contact'} 
             onClick={() => setActiveTab('contact')}
             pingColor="bg-cyber-neon-pink"
           >
             滴滴。CALL我
           </CyberButton>
        </nav>

        {/* Secret Contact Modal */}
        <AnimatePresence>
           {activeTab === 'contact' && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
             >
                <div className="glass-cyber p-10 max-w-lg w-full cyber-border cyber-clip relative">
                   <button 
                     onClick={() => setActiveTab('works')}
                     className="absolute top-4 right-6 text-white/50 hover:text-cyber-neon-pink font-cyber text-sm tracking-widest pointer-events-auto"
                   >
                     [ CLOSE ]
                   </button>
                   <TerminalSquare className="text-cyber-neon-pink w-12 h-12 mb-6" />
                   <h2 className="text-3xl font-bold mb-2">解锁隐藏关卡</h2>
                   <p className="text-white/50 font-cyber text-xs tracking-widest mb-10">DECRYPT CONTACT INFORMATION</p>
                   
                   <div className="space-y-6 font-cyber text-sm tracking-wider relative z-10 pointer-events-auto">
                      <div className="flex items-center gap-4 bg-black/50 p-4 border-l-2 border-cyber-neon-cyan">
                         <span className="text-cyber-neon-cyan">SYS.EMAIL {'>'}</span>
                         <a href="mailto:wenlingtang3@gmail.com" className="hover:text-cyber-neon-cyan transition-colors">wenlingtang3@gmail.com</a>
                      </div>
                      <div className="flex items-center gap-4 bg-black/50 p-4 border-l-2 border-cyber-neon-pink">
                         <span className="text-cyber-neon-pink">SYS.ROLE {'>'}</span>
                         <span>AIGC / ART DIRECTOR</span>
                      </div>
                      <div className="flex items-center gap-4 bg-black/50 p-4 border-l-2 border-cyber-neon-purple">
                         <span className="text-cyber-neon-purple">SYS.STATUS {'>'}</span>
                         <span className="animate-pulse">AVAILABLE FOR HIRE</span>
                      </div>
                   </div>
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
}
