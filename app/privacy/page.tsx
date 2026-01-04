'use client'

import React from 'react'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function PrivacyPage() {
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
            Politique de confidentialité
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
                <h2 className="text-xl font-bold text-ios-label mb-4">1. Introduction</h2>
                <p className="text-ios-label mb-4">
                  Bienvenue sur anCuisine. Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles.
                  Cette politique de confidentialité vous explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre application.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">2. Données collectées</h2>

                <h3 className="text-lg font-semibold text-ios-label mb-3">2.1 Informations d'identification</h3>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Adresse e-mail (pour la création de compte via Supabase Auth)</li>
                  <li>Mot de passe (stocké de manière sécurisée et chiffré)</li>
                  <li>Identifiant utilisateur unique (généré automatiquement)</li>
                </ul>

                <h3 className="text-lg font-semibold text-ios-label mb-3">2.2 Données de l'application</h3>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Recettes créées (titre, catégorie, ingrédients, étapes, notes)</li>
                  <li>URLs d'images (liens vers des images externes, notamment Pinterest)</li>
                  <li>Préférences de cuisson et paramètres de recettes</li>
                  <li>Métadonnées (dates de création et modification)</li>
                </ul>

                <h3 className="text-lg font-semibold text-ios-label mb-3">2.3 Données techniques</h3>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Adresse IP (pour la sécurité et la prévention des abus)</li>
                  <li>Type de navigateur et système d'exploitation</li>
                  <li>Données de session et cookies d'authentification</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">3. Utilisation des données</h2>
                <p className="text-ios-label mb-3">Nous utilisons vos données pour :</p>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li><strong>Fournir le service :</strong> Créer, stocker et gérer vos recettes</li>
                  <li><strong>Authentification :</strong> Sécuriser votre compte et vos données</li>
                  <li><strong>Amélioration :</strong> Améliorer l'expérience utilisateur et les fonctionnalités</li>
                  <li><strong>Support :</strong> Répondre à vos questions et résoudre les problèmes</li>
                  <li><strong>Sécurité :</strong> Détecter et prévenir les activités frauduleuses</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">4. Intégration Pinterest</h2>
                <p className="text-ios-label mb-3">
                  Notre application utilise l'API Pinterest pour vous permettre de rechercher et sélectionner des images de haute qualité pour vos recettes.
                </p>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li><strong>Données partagées :</strong> Vos requêtes de recherche sont envoyées à Pinterest</li>
                  <li><strong>Stockage :</strong> Seules les URLs des images sont stockées (pas les images elles-mêmes)</li>
                  <li><strong>Politique Pinterest :</strong> L'utilisation de Pinterest est soumise à leur <a href="https://policy.pinterest.com/privacy-policy" className="text-ios-pink hover:underline" target="_blank" rel="noopener noreferrer">politique de confidentialité</a></li>
                  <li><strong>Optionnel :</strong> L'utilisation de Pinterest est facultative</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">5. Stockage et sécurité</h2>

                <h3 className="text-lg font-semibold text-ios-label mb-3">5.1 Infrastructure</h3>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li><strong>Base de données :</strong> Supabase (hébergement sécurisé)</li>
                  <li><strong>Authentification :</strong> Supabase Auth avec chiffrement</li>
                  <li><strong>Localisation :</strong> Données hébergées dans l'UE</li>
                </ul>

                <h3 className="text-lg font-semibold text-ios-label mb-3">5.2 Mesures de sécurité</h3>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li>Chiffrement des mots de passe avec bcrypt</li>
                  <li>HTTPS pour toutes les communications</li>
                  <li>Authentification par tokens sécurisés</li>
                  <li>Row Level Security (RLS) sur la base de données</li>
                  <li>Protection contre les injections SQL et XSS</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">6. Partage des données</h2>
                <p className="text-ios-label mb-3">
                  <strong>Nous ne vendons jamais vos données personnelles.</strong>
                </p>
                <p className="text-ios-label mb-3">Vos données peuvent être partagées uniquement dans les cas suivants :</p>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li><strong>Services tiers :</strong> Supabase (hébergement), Pinterest (recherche d'images)</li>
                  <li><strong>Obligations légales :</strong> Si requis par la loi ou une autorité compétente</li>
                  <li><strong>Protection :</strong> Pour protéger nos droits, notre sécurité ou celle des utilisateurs</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">7. Vos droits (RGPD)</h2>
                <p className="text-ios-label mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li><strong>Accès :</strong> Obtenir une copie de vos données</li>
                  <li><strong>Rectification :</strong> Corriger vos données inexactes</li>
                  <li><strong>Suppression :</strong> Demander la suppression de vos données</li>
                  <li><strong>Portabilité :</strong> Recevoir vos données dans un format structuré</li>
                  <li><strong>Opposition :</strong> Vous opposer au traitement de vos données</li>
                  <li><strong>Limitation :</strong> Demander la limitation du traitement</li>
                </ul>
                <p className="text-ios-label mt-4">
                  Pour exercer ces droits, vous pouvez supprimer votre compte directement depuis les paramètres de l'application ou exporter vos données.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">8. Cookies et stockage local</h2>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li><strong>Cookies de session :</strong> Pour maintenir votre connexion</li>
                  <li><strong>LocalStorage :</strong> Pour améliorer les performances</li>
                  <li><strong>Durée :</strong> Les cookies de session expirent à la déconnexion</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">9. Conservation des données</h2>
                <ul className="list-disc pl-6 mb-4 text-ios-label space-y-2">
                  <li><strong>Compte actif :</strong> Tant que votre compte existe</li>
                  <li><strong>Suppression de compte :</strong> Données supprimées dans les 30 jours</li>
                  <li><strong>Obligations légales :</strong> Certaines données peuvent être conservées plus longtemps si requis par la loi</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">10. Modifications</h2>
                <p className="text-ios-label mb-4">
                  Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications importantes vous seront notifiées
                  par e-mail ou via l'application. La date de dernière mise à jour est indiquée en haut de cette page.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">11. Contact</h2>
                <p className="text-ios-label mb-4">
                  Pour toute question concernant cette politique de confidentialité ou vos données personnelles, vous pouvez gérer vos préférences
                  directement depuis les paramètres de l'application ou via les options de votre compte.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-bold text-ios-label mb-4">12. Utilisateurs mineurs</h2>
                <p className="text-ios-label mb-4">
                  Notre application peut être utilisée par des personnes de tout âge. Pour les mineurs, nous recommandons une utilisation
                  sous la supervision d'un adulte. Les parents ou tuteurs légaux sont responsables de l'utilisation de l'application par les mineurs.
                </p>
                <p className="text-ios-label mb-4">
                  Nous collectons uniquement les données nécessaires au fonctionnement du service (recettes personnelles) et nous nous engageons
                  à protéger la vie privée de tous nos utilisateurs, y compris les mineurs.
                </p>
              </section>
            </div>
          </Card>

          {/* Footer avec liens */}
          <div className="text-center text-sm text-ios-label-secondary pb-8">
            <p>© {new Date().getFullYear()} anCuisine - Tous droits réservés</p>
          </div>
        </div>
      </Container>
    </div>
  )
}
