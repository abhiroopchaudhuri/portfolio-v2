import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Projects from './projects';

const FrontendProjects = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Parallax effect for the header
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Back Button */}


      {/* Header */}
      <motion.header
        style={{ y, opacity }}
        className="h-[60vh] flex flex-col justify-center items-center relative z-10"
      >
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[8vw] font-black leading-none tracking-tighter text-center mix-blend-overlay"
        >
          SELECTED<br />WORKS
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: "circOut" }}
          className="w-24 h-1 bg-white mt-8"
        />
      </motion.header>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 pb-32 relative z-10">
        <div className="grid grid-cols-1 gap-32">
          {Projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center min-h-[60vh]`}
    >
      {/* Image Section */}
      <div className="w-full md:w-3/5 relative group cursor-pointer overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        <motion.img
          src={`${process.env.PUBLIC_URL}/${project.imageLink}`}
          alt={project.title}
          className="w-full h-full object-cover aspect-video filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
        />

        <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex gap-4">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-white text-black font-bold text-sm tracking-widest hover:bg-[var(--accent-color)] hover:text-white transition-colors"
            >
              LIVE DEMO
            </a>
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-white text-white font-bold text-sm tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              GITHUB
            </a>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div className="w-full md:w-2/5 space-y-6">
        <motion.span
          className="text-[var(--accent-color)] font-mono text-sm tracking-widest"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          0{index + 1}
        </motion.span>

        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
          {project.title}
        </h2>

        <div
          className="text-gray-400 font-light leading-relaxed text-sm md:text-base"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />

        <div className="h-[1px] w-full bg-white/10 mt-8" />
      </div>
    </motion.div>
  );
};

export default FrontendProjects;
