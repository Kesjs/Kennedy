import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, Zap, Users, Globe, TrendingUp } from 'lucide-react';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const stats = [
    { value: '100%', label: 'Sécurité' },
    { value: '24/7', label: 'Disponibilité' },
    { value: '1000+', label: 'Investisseurs' },
    { value: '99.9%', label: 'Satisfaction' },
  ];

  return (
    <section id="about" className="relative py-20 overflow-hidden bg-black from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            À propos de Gazoduc Invest
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Découvrez notre vision et notre engagement pour révolutionner l'investissement dans le GNL.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div 
              className="bg-gradient-to-r from-primary/10 to-indigo-500/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm"
              variants={fadeInUp}
              custom={0}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Notre Mission</h3>
                  <p className="text-gray-300">
                    Gazoduc Invest est une plateforme d'investissement innovante spécialisée dans le Gaz Naturel Liquéfié (GNL).
                    Notre mission est de démocratiser l'accès aux opportunités d'investissement dans le secteur de l'énergie,
                    en offrant des solutions accessibles, transparentes et performantes.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-r from-primary/10 to-indigo-500/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm"
              variants={fadeInUp}
              custom={1}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-500/10 rounded-lg">
                  <Globe className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Notre Vision</h3>
                  <p className="text-gray-300">
                    Nous croyons en un avenir où l'énergie est propre, abordable et accessible à tous.
                    En nous appuyant sur l'innovation technologique et l'expertise de nos équipes,
                    nous ouvrons la voie à une nouvelle ère d'investissement responsable dans le secteur énergétique.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
                title: 'Sécurité',
                description: 'Protection maximale de vos investissements avec des protocoles avancés.'
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: 'Performance',
                description: 'Rendements compétitifs grâce à notre expertise dans le secteur du GNL.'
              },
              {
                icon: <Users className="w-8 h-8 text-blue-400" />,
                title: 'Communauté',
                description: 'Rejoignez une communauté grandissante d\'investisseurs avertis.'
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
                title: 'Croissance',
                description: 'Bénéficiez du potentiel de croissance du marché du GNL.'
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-br from-white/5 to-white/[0.01] p-6 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/[0.03] transition-all duration-300"
                variants={fadeInUp}
                custom={index + 2}
              >
                <div className="mb-4">
                  <div className="p-3 bg-white/5 rounded-lg w-fit">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="p-6 bg-gradient-to-br from-white/5 to-white/[0.01] rounded-2xl border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
