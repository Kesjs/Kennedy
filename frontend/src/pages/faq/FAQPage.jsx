import { ChevronDownIcon } from '@heroicons/react/24/outline';
import PageTemplate from "../../components/PageTemplate";

export const metadata = {
  title: 'FAQ - Gazoduc Invest',
  description: 'Trouvez des réponses aux questions fréquemment posées sur Gazoduc Invest et nos services d\'investissement en GNL.'
};

const faqs = [
  {
    question: "Comment fonctionne l'investissement dans le GNL avec Gazoduc Invest ?",
    answer: "Gazoduc Invest vous permet d'investir dans des réservoirs de Gaz Naturel Liquéfié. Vous achetez des parts de réservoirs et recevez des revenus quotidiens basés sur la performance des actifs sous-jacents. Les fonds sont gérés par nos experts pour maximiser les rendements tout en minimisant les risques."
  },
  {
    question: "Quels sont les risques liés à cet investissement ?",
    answer: "Comme tout investissement, celui-ci comporte des risques, notamment la perte en capital. Les performances passées ne préjugent pas des performances futures. Les prix du GNL peuvent varier en fonction des marchés mondiaux, des conditions économiques et de la demande énergétique. Nous recommandons de ne pas investir plus que ce que vous pouvez vous permettre de perdre."
  },
  {
    question: "Quel est le montant minimum d'investissement ?",
    answer: "Le montant minimum d'investissement est de 32€ pour le forfait Starter. Nous proposons différents niveaux d'investissement pour s'adapter à tous les budgets et objectifs."
  },
  {
    question: "Quand et comment puis-je retirer mes gains ?",
    answer: "Les gains sont crédités quotidiennement sur votre compte Gazoduc Invest. Vous pouvez effectuer un retrait à tout moment, sous réserve d'un montant minimum de retrait de 10€. Les retraits sont traités sous 2 à 5 jours ouvrés selon votre méthode de retrait."
  },
  {
    question: "Comment sont calculés les rendements ?",
    answer: "Les rendements sont calculés quotidiennement sur la base de la performance des actifs sous-jacents. Les taux varient selon le type de réservoir choisi et les conditions du marché. Vous pouvez suivre en temps réel l'évolution de vos investissements depuis votre tableau de bord."
  },
  {
    question: "Quelle est la fiscalité applicable ?",
    answer: "Les plus-values réalisées sont soumises à l'impôt sur le revenu dans la catégorie des revenus de capitaux mobiliers. Un prélèvement forfaitaire unique (PFU) de 30% s'applique par défaut, sauf option pour le barème progressif de l'impôt sur le revenu. Nous vous conseillons de consulter un conseiller fiscal pour des informations personnalisées."
  },
  {
    question: "Comment puis-je contacter le support client ?",
    answer: "Notre équipe est disponible du lundi au vendredi de 9h à 18h pour répondre à vos questions. Vous pouvez nous contacter par email à support@gazoduc-invest.com ou via le formulaire de contact dans votre espace client. Nous nous engageons à vous répondre sous 24 heures ouvrées."
  }
];

export default function FAQPage() {
  return (
    <PageTemplate 
      title="Foire Aux Questions"
      description="Trouvez les réponses à vos questions sur Gazoduc Invest et nos services d'investissement en GNL."
    >
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-between p-6 bg-white/50 dark:bg-black/30 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-white/70 dark:hover:bg-black/40 transition-colors">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <ChevronDownIcon 
                  className="w-5 h-5 text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-transform duration-200 group-hover:rotate-180" 
                  aria-hidden="true" 
                />
              </div>
              <div className="px-6 pt-2 pb-4 bg-white/30 dark:bg-black/20 backdrop-blur-sm rounded-b-xl border border-t-0 border-gray-200 dark:border-white/10">
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Vous avez d'autres questions ?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question complémentaire.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:support@gazoduc-invest.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Nous contacter
            </a>
            <a
              href="/how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Comment ça marche ?
            </a>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
