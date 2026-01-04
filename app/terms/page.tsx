'use client'

import React from 'react'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-ios-bg">
      {/* Header */}
      <header className="bg-ios-bg-secondary/80 backdrop-blur-lg border-b border-ios-separator sticky top-0 z-40">
        <div className="container px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Retour
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-ios-label">
            Conditions d'utilisation
          </h1>
        </div>
      </header>

      <Container maxWidth="lg">
        <div className="space-y-6 py-6">
          <Card>
            <div className="prose prose-sm sm:prose max-w-none">
              <p className="text-ios-label-secondary text-sm mb-6">
                <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">1. Acceptation des conditions</h2>
                <p className="text-ios-label mb-4">
                  En accédant et en utilisant anCuisine (ci-après "l'Application"), vous acceptez d'être lié par ces conditions d'utilisation.
                  Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'Application.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">2. Description du service</h2>
                <p className="text-ios-label mb-4">
                  anCuisine est une application web gratuite de gestion de recettes personnelles qui vous permet de :
                </p>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Créer, modifier et supprimer vos recettes</li>
                  <li>Organiser vos recettes par catégories</li>
                  <li>Suivre des étapes de cuisine pas à pas</li>
                  <li>Rechercher des images sur Pinterest pour illustrer vos recettes</li>
                  <li>Gérer vos ingrédients et temps de préparation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">3. Compte utilisateur</h2>

                <h3 className="text-lg font-semibold text-ios-label mb-3">3.1 Création de compte</h3>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Vous devez créer un compte pour utiliser l'Application</li>
                  <li>Vous devez fournir une adresse e-mail valide</li>
                  <li>Vous êtes responsable de la sécurité de votre mot de passe</li>
                  <li>Les mineurs peuvent utiliser l'Application sous supervision d'un adulte</li>
                </ul>

                <h3 className="text-lg font-semibold text-ios-label mb-3">3.2 Responsabilités</h3>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Vous êtes responsable de toutes les activités sur votre compte</li>
                  <li>Vous devez nous notifier immédiatement de tout accès non autorisé</li>
                  <li>Un seul compte par personne est autorisé</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">4. Utilisation acceptable</h2>

                <h3 className="text-lg font-semibold text-ios-label mb-3">4.1 Vous acceptez de NE PAS :</h3>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Utiliser l'Application à des fins illégales</li>
                  <li>Publier du contenu offensant, diffamatoire ou inapproprié</li>
                  <li>Usurper l'identité d'une autre personne</li>
                  <li>Tenter de pirater ou de compromettre la sécurité de l'Application</li>
                  <li>Utiliser des robots ou scripts automatisés sans autorisation</li>
                  <li>Collecter des données d'autres utilisateurs</li>
                  <li>Surcharger nos serveurs par un usage abusif</li>
                </ul>

                <h3 className="text-lg font-semibold text-ios-label mb-3">4.2 Contenu utilisateur</h3>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Vous conservez tous les droits sur les recettes que vous créez</li>
                  <li>Vous êtes responsable du contenu que vous publiez</li>
                  <li>Vous ne devez pas violer les droits d'auteur d'autrui</li>
                  <li>Les images Pinterest sont soumises aux conditions de Pinterest</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">5. Propriété intellectuelle</h2>

                <h3 className="text-lg font-semibold text-ios-label mb-3">5.1 Notre propriété</h3>
                <p className="text-ios-label mb-4">
                  L'Application, son code source, son design et tous les éléments associés sont protégés par les lois sur la propriété intellectuelle.
                  Vous ne pouvez pas copier, modifier ou distribuer l'Application sans notre autorisation écrite.
                </p>

                <h3 className="text-lg font-semibold text-ios-label mb-3">5.2 Votre contenu</h3>
                <p className="text-ios-label mb-4">
                  Vous conservez tous les droits sur vos recettes. En utilisant l'Application, vous nous accordez une licence limitée
                  pour stocker et afficher votre contenu dans le cadre du service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">6. Services tiers</h2>

                <h3 className="text-lg font-semibold text-ios-label mb-3">6.1 Pinterest</h3>
                <p className="text-ios-label mb-4">
                  L'intégration Pinterest est soumise aux <a href="https://policy.pinterest.com/terms-of-service" className="text-ios-pink hover:underline" target="_blank" rel="noopener noreferrer">conditions d'utilisation de Pinterest</a>.
                  Nous ne sommes pas responsables du contenu Pinterest ou de leur disponibilité.
                </p>

                <h3 className="text-lg font-semibold text-ios-label mb-3">6.2 Supabase</h3>
                <p className="text-ios-label mb-4">
                  Nos données sont hébergées sur Supabase. Leur utilisation est soumise à leurs propres conditions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">7. Limitation de responsabilité</h2>

                <h3 className="text-lg font-semibold text-ios-label mb-3">7.1 Service "tel quel"</h3>
                <p className="text-ios-label mb-4">
                  L'Application est fournie "telle quelle" sans garantie d'aucune sorte. Nous ne garantissons pas que :
                </p>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Le service sera ininterrompu ou sans erreur</li>
                  <li>Les défauts seront corrigés</li>
                  <li>Le service répondra à vos besoins spécifiques</li>
                </ul>

                <h3 className="text-lg font-semibold text-ios-label mb-3">7.2 Exclusion de dommages</h3>
                <p className="text-ios-label mb-4">
                  Nous ne serons pas responsables des dommages indirects, accessoires, spéciaux ou consécutifs résultant de
                  votre utilisation ou de votre incapacité à utiliser l'Application.
                </p>

                <h3 className="text-lg font-semibold text-ios-label mb-3">7.3 Recettes et sécurité alimentaire</h3>
                <p className="text-ios-label mb-4">
                  <strong>Important :</strong> Nous ne sommes pas responsables de la sécurité alimentaire, des allergies ou des problèmes de santé
                  liés aux recettes. Vérifiez toujours les ingrédients et consultez un professionnel de santé en cas de doute.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">8. Disponibilité du service</h2>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Nous nous réservons le droit de modifier ou d'interrompre le service à tout moment</li>
                  <li>Nous pouvons effectuer des maintenances sans préavis</li>
                  <li>Nous ne garantissons aucun niveau de disponibilité (SLA)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">9. Résiliation</h2>

                <h3 className="text-lg font-semibold text-ios-label mb-3">9.1 Par vous</h3>
                <p className="text-ios-label mb-4">
                  Vous pouvez supprimer votre compte à tout moment. Vos données seront supprimées conformément à notre
                  <a href="/privacy" className="text-ios-pink hover:underline ml-1">politique de confidentialité</a>.
                </p>

                <h3 className="text-lg font-semibold text-ios-label mb-3">9.2 Par nous</h3>
                <p className="text-ios-label mb-4">
                  Nous pouvons suspendre ou résilier votre compte si :
                </p>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Vous violez ces conditions d'utilisation</li>
                  <li>Votre comportement nuit à l'Application ou aux autres utilisateurs</li>
                  <li>Nous cessons d'offrir le service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">10. Modifications des conditions</h2>
                <p className="text-ios-label mb-4">
                  Nous pouvons modifier ces conditions à tout moment. Les modifications importantes vous seront notifiées
                  par e-mail ou via l'Application. Votre utilisation continue après notification constitue votre acceptation des nouvelles conditions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">11. Loi applicable</h2>
                <p className="text-ios-label mb-4">
                  Ces conditions sont régies par les lois françaises. Tout litige sera soumis à la compétence exclusive des tribunaux français.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">12. Contact</h2>
                <p className="text-ios-label mb-4">
                  Pour toute question concernant ces conditions, vous pouvez consulter la <a href="/privacy" className="text-ios-pink hover:underline">politique de confidentialité</a> ou
                  gérer vos préférences depuis les paramètres de l'application.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">13. Divisibilité</h2>
                <p className="text-ios-label mb-4">
                  Si une disposition de ces conditions est jugée invalide ou inapplicable, les autres dispositions resteront en vigueur.
                </p>
              </section>
            </div>
          </Card>

          {/* Footer avec liens */}
          <div className="text-center text-sm text-ios-label-secondary pb-8">
            <p>© {new Date().getFullYear()} anCuisine - Tous droits réservés</p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="/privacy" className="text-ios-pink hover:underline">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
