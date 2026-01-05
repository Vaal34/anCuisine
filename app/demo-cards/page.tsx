'use client'

import { RecipeCard } from '@/components/recipe/RecipeCard'
import { Container } from '@/components/layout/Container'
import { Clock, Users, ChefHat } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Recipe } from '@/types'
import { CATEGORIES } from '@/types'

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    user_id: 'demo',
    title: 'Tarte aux pommes maison',
    category: 'dessert',
    prep_time: 20,
    cook_time: 45,
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1535920527002-b35e96722eb9?w=800',
    ingredients: [
      { ingredientId: '1', name: 'Farine', quantity: 250, unit: 'g' },
      { ingredientId: '2', name: 'Sucre', quantity: 100, unit: 'g' },
      { ingredientId: '3', name: 'Pommes', quantity: 4, unit: null },
      { ingredientId: '4', name: 'Beurre', quantity: 125, unit: 'g' },
    ],
    steps: [
      'Préchauffer le four à 180°C',
      'Préparer la pâte en mélangeant farine, sucre et beurre',
      'Étaler la pâte dans un moule',
      'Disposer les pommes coupées en tranches',
      'Enfourner 45 minutes',
    ],
    notes: 'Servir tiède avec une boule de glace vanille',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'demo',
    title: 'Soupe à l\'oignon gratinée',
    category: 'entree',
    prep_time: 15,
    cook_time: 40,
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
    ingredients: [
      { ingredientId: '1', name: 'Oignons', quantity: 6, unit: null },
      { ingredientId: '2', name: 'Bouillon de boeuf', quantity: 1, unit: 'L' },
      { ingredientId: '3', name: 'Gruyère', quantity: 200, unit: 'g' },
      { ingredientId: '4', name: 'Pain', quantity: 4, unit: 'tranches' },
    ],
    steps: [
      'Émincer les oignons finement',
      'Faire revenir les oignons dans du beurre',
      'Ajouter le bouillon et laisser mijoter 30 min',
      'Verser dans des bols, ajouter pain et fromage',
      'Gratiner au four 10 minutes',
    ],
    notes: 'Un classique réconfortant de la cuisine française',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'demo',
    title: 'Poulet rôti aux herbes',
    category: 'plat',
    prep_time: 15,
    cook_time: 60,
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    ingredients: [
      { ingredientId: '1', name: 'Poulet entier', quantity: 1, unit: null },
      { ingredientId: '2', name: 'Thym', quantity: 4, unit: 'branches' },
      { ingredientId: '3', name: 'Romarin', quantity: 2, unit: 'branches' },
      { ingredientId: '4', name: 'Citron', quantity: 1, unit: null },
    ],
    steps: [
      'Préchauffer le four à 200°C',
      'Farcir le poulet avec herbes et citron',
      'Badigeonner d\'huile d\'olive',
      'Enfourner 1h en arrosant régulièrement',
      'Laisser reposer 10 min avant de découper',
    ],
    notes: 'Parfait pour un repas en famille',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const sampleRecipe = sampleRecipes[0]

// Card 1: Hero Card - Image immersive avec glassmorphism
function HeroCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <div className="relative h-[420px] cursor-pointer group overflow-hidden rounded-3xl corner-squircle shadow-ios-lg">
      <img
        src={recipe.image_url}
        alt={recipe.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Floating action button */}
      <button className="absolute top-6 right-6 w-14 h-14 rounded-2xl corner-squircle bg-white/15 border border-white/20 hover:bg-white/25 shadow-ios-lg transition-all duration-300 flex items-center justify-center text-white group-hover:scale-110">
        <ChefHat className="w-7 h-7" />
      </button>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
        <Badge variant="recipe" className="bg-white/10 border-white/20 text-white">
          {categoryLabel}
        </Badge>
        <h3 className="text-3xl font-bold text-white tracking-tight">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-full flex items-center gap-2 text-white text-sm font-medium">
            <Clock className="w-4 h-4" />
            {totalTime} min
          </div>
          <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-full flex items-center gap-2 text-white text-sm font-medium">
            <Users className="w-4 h-4" />
            {recipe.servings} pers.
          </div>
        </div>
      </div>
    </div>
  )
}

// Card 2: Compact Card - Design épuré et élégant
function CompactCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <div className="bg-white rounded-3xl corner-squircle shadow-ios-sm hover:shadow-ios-lg transition-all duration-500 cursor-pointer group overflow-hidden">
      {/* Image section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating button on image */}
        <button className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl corner-squircle bg-ios-pink hover:bg-ios-pink-dark shadow-ios-lg transition-all duration-300 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
          <ChefHat className="w-6 h-6" />
        </button>
      </div>

      {/* Content section */}
      <div className="p-5 space-y-3">
        <Badge variant="recipe">{categoryLabel}</Badge>
        <h3 className="text-xl font-bold text-ios-label line-clamp-2 leading-tight">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-4 text-ios-label-tertiary text-sm pt-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{totalTime} min</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-ios-separator" />
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} pers.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Card 3: Minimal Card - Style magazine minimaliste
function MinimalCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <div className="cursor-pointer group">
      {/* Image avec overlay subtil */}
      <div className="relative h-64 overflow-hidden rounded-3xl corner-squircle mb-5 shadow-ios-sm group-hover:shadow-ios-md transition-all duration-500">
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-100"
        />

        {/* Minimal overlay badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="recipe" className="bg-white/95 shadow-ios-sm">
            {categoryLabel}
          </Badge>
        </div>

        {/* Subtle action button bottom right */}
        <button className="absolute bottom-4 right-4 w-11 h-11 rounded-2xl corner-squircle bg-ios-pink/95 hover:bg-ios-pink shadow-ios-md hover:shadow-ios-lg transition-all duration-300 flex items-center justify-center text-white scale-95 group-hover:scale-100">
          <ChefHat className="w-5 h-5" />
        </button>
      </div>

      {/* Clean content below */}
      <div className="space-y-2.5 px-1">
        <h3 className="text-xl font-bold text-ios-label line-clamp-2 leading-snug">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-3 text-ios-label-tertiary text-sm">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{totalTime} min</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-ios-separator" />
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{recipe.servings} personnes</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Card 4: Liquid Glass Card - Effet verre liquide iOS 18
function LiquidGlassCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <div className="relative h-[340px] cursor-pointer group overflow-hidden rounded-[2.5rem] corner-squircle shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
      {/* Background image */}
      <img
        src={recipe.image_url}
        alt={recipe.title}
        className="absolute inset-0 w-full h-full object-cover rounded-[2.5rem] corner-squircle scale-110 group-hover:scale-115 transition-transform duration-[1200ms] ease-out"
      />

      {/* Liquid glass layers */}
      <div className="absolute inset-0 rounded-[2.5rem] corner-squircle">
        {/* Base gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/60 rounded-[2.5rem] corner-squircle" />

        {/* Animated gradient mesh (liquid effect) */}
        <div className="absolute inset-0 bg-gradient-to-br from-ios-pink/20 via-transparent to-purple-500/10 opacity-60 group-hover:opacity-80 transition-opacity duration-700 rounded-[2.5rem] corner-squircle" />
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 via-transparent to-ios-pink/15 opacity-40 group-hover:opacity-60 transition-opacity duration-1000 rounded-[2.5rem] corner-squircle" />

        {/* Glass blur layer */}
        <div className="absolute inset-0 group-hover:bg-white/5 transition-all duration-700 rounded-[2.5rem] corner-squircle" />
      </div>

      {/* Floating glass elements */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Top section with glass morphism */}
        <div className="flex items-start justify-between">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
            <Badge
              variant="recipe"
              className="relative bg-white/[0.15] border border-white/[0.25] text-white shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
            >
              {categoryLabel}
            </Badge>
          </div>

          {/* Liquid glass button */}
          <button className="relative group/btn">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-ios-pink/40 blur-xl rounded-xl corner-squircle opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />

            {/* Glass button */}
            <div className="relative w-11 h-11 rounded-xl corner-squircle bg-white/[0.08] border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all duration-500 group-hover/btn:bg-white/[0.15] group-hover/btn:scale-110 group-hover/btn:border-white/[0.25]">
              <ChefHat className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          </button>
        </div>

        {/* Bottom section with enhanced glass */}
        <div className="space-y-3">
          {/* Glass container for title */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-white/[0.03] rounded-2xl corner-squircle border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.2)]" />
            <div className="relative px-5 py-4">
              <h3 className="text-3xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] tracking-tight line-clamp-2">
                {recipe.title}
              </h3>
            </div>
          </div>

          {/* Glass pills for info */}
          <div className="flex items-center gap-2">
            <div className="relative group/pill flex-1">
              <div className="absolute inset-0 bg-white/5 blur-lg rounded-full" />
              <div className="relative px-4 py-2 bg-white/[0.1] border border-white/[0.2] rounded-full flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-300 group-hover/pill:bg-white/[0.15] group-hover/pill:border-white/[0.3]">
                <Clock className="w-4 h-4 text-white/90" />
                <span className="text-sm font-semibold text-white drop-shadow-sm">{totalTime} min</span>
              </div>
            </div>

            <div className="relative group/pill flex-1">
              <div className="absolute inset-0 bg-white/5 blur-lg rounded-full" />
              <div className="relative px-4 py-2 bg-white/[0.1] border border-white/[0.2] rounded-full flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-300 group-hover/pill:bg-white/[0.15] group-hover/pill:border-white/[0.3]">
                <Users className="w-4 h-4 text-white/90" />
                <span className="text-sm font-semibold text-white drop-shadow-sm">{recipe.servings} pers.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edge glow effect */}
      <div className="absolute inset-0 rounded-[2.5rem] corner-squircle ring-1 ring-inset ring-white/[0.05] pointer-events-none" />
    </div>
  )
}

// Card 5: Concentric Shapes Card - Basé sur la concentricité (lignes 22-33 du texte)
function ConcentricCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <div className="relative cursor-pointer group">
      {/* Outer concentric layer */}
      <div className="p-4 bg-gradient-to-br from-ios-pink/5 to-purple-500/5 rounded-[2.5rem] corner-squircle">
        {/* Middle concentric layer */}
        <div className="p-3 bg-white/80 rounded-[2rem] corner-squircle shadow-ios-sm">
          {/* Inner concentric layer with image */}
          <div className="relative h-72 rounded-[1.5rem] corner-squircle overflow-hidden shadow-ios-md group-hover:shadow-ios-lg transition-all duration-500">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Nested content with concentric alignment */}
            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
              {/* Innermost concentric element */}
              <div className="inline-block p-3 bg-white/10 rounded-2xl corner-squircle border border-white/20">
                <Badge variant="recipe" className="bg-transparent border-0 text-white p-0 m-0">
                  {categoryLabel}
                </Badge>
              </div>

              <h3 className="text-2xl font-bold text-white">
                {recipe.title}
              </h3>

              {/* Concentric pills */}
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-white/15 rounded-full border border-white/25 text-white text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {totalTime} min
                </div>
                <div className="px-4 py-2 bg-white/15 rounded-full border border-white/25 text-white text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {recipe.servings}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Card 6: Capsule Shapes Card - Basé sur les formes capsules (lignes 26-32)
function CapsuleCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <div className="bg-white rounded-[2rem] corner-squircle shadow-ios-md hover:shadow-ios-lg transition-all duration-500 cursor-pointer group overflow-hidden">
      {/* Image section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content with capsule elements */}
      <div className="p-5 space-y-4">
        {/* Capsule badge */}
        <div className="inline-block">
          <div className="px-5 py-2 bg-ios-pink/10 rounded-full border border-ios-pink/20">
            <span className="text-sm font-semibold text-ios-pink">{categoryLabel}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-ios-label line-clamp-2">
          {recipe.title}
        </h3>

        {/* Capsule info pills - perfect capsules (height/2 radius) */}
        <div className="flex gap-2">
          <div className="flex-1 h-10 px-4 bg-ios-bg rounded-full flex items-center justify-center gap-2 text-ios-label-secondary">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{totalTime} min</span>
          </div>
          <div className="flex-1 h-10 px-4 bg-ios-bg rounded-full flex items-center justify-center gap-2 text-ios-label-secondary">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{recipe.servings} pers.</span>
          </div>
        </div>

        {/* Large capsule action button */}
        <button className="w-full h-12 bg-ios-pink hover:bg-ios-pink-dark rounded-full flex items-center justify-center gap-2 text-white font-semibold shadow-ios-md hover:shadow-ios-lg transition-all duration-300">
          <ChefHat className="w-5 h-5" />
          <span>Commencer</span>
        </button>
      </div>
    </div>
  )
}

// Card 7: Scroll Edge Effect Card - Basé sur les effets de bord (lignes 87-102)
function ScrollEdgeCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <div className="relative h-96 cursor-pointer group overflow-hidden rounded-3xl corner-squircle shadow-ios-lg">
      {/* Background image */}
      <img
        src={recipe.image_url}
        alt={recipe.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Top scroll edge effect - soft blur */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />

      {/* Top floating bar with Liquid Glass */}
      <div className="absolute top-4 left-4 right-4">
        <div className="h-14 px-5 bg-white/10 border border-white/20 rounded-2xl corner-squircle shadow-ios-lg flex items-center justify-between">
          <Badge variant="recipe" className="bg-white/20 border-white/30 text-white">
            {categoryLabel}
          </Badge>
          <button className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all duration-300">
            <ChefHat className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom scroll edge effect - hard boundary */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
        <h3 className="text-2xl font-bold text-white drop-shadow-lg">
          {recipe.title}
        </h3>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white/15 border border-white/25 rounded-full text-white text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {totalTime} min
          </div>
          <div className="px-4 py-2 bg-white/15 border border-white/25 rounded-full text-white text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            {recipe.servings}
          </div>
        </div>
      </div>
    </div>
  )
}

// Card 8: Spatial Organization Card - Basé sur l'organisation spatiale (lignes 51-56)
function SpatialCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <div className="relative cursor-pointer group">
      {/* Main surface */}
      <div className="bg-ios-bg rounded-3xl corner-squircle overflow-hidden shadow-ios-sm hover:shadow-ios-md transition-all duration-500">
        {/* Image with spatial depth */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Floating element that springs from source */}
          <div className="absolute top-4 right-4">
            <button className="w-12 h-12 bg-white/95 rounded-2xl corner-squircle shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:scale-110 transition-all duration-300 flex items-center justify-center text-ios-pink group-hover:rotate-12">
              <ChefHat className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content surface with clear hierarchy */}
        <div className="p-5 space-y-4 bg-white">
          {/* Source element for badge */}
          <div className="flex items-center justify-between">
            <Badge variant="recipe">{categoryLabel}</Badge>
            <div className="text-xs text-ios-label-tertiary">
              {recipe.ingredients.length} ingrédients
            </div>
          </div>

          <h3 className="text-xl font-bold text-ios-label line-clamp-2">
            {recipe.title}
          </h3>

          {/* Grouped related elements */}
          <div className="p-3 bg-ios-bg/50 rounded-2xl corner-squircle flex items-center justify-around">
            <div className="flex items-center gap-2 text-ios-label-secondary">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{totalTime} min</span>
            </div>
            <div className="w-px h-6 bg-ios-separator" />
            <div className="flex items-center gap-2 text-ios-label-secondary">
              <Users className="w-4 h-4" />
              <span className="text-sm">{recipe.servings} pers.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Card 9: Material Variation Card - Basé sur la variation des matériaux (lignes 57-61)
function MaterialVariationCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <div className="relative h-96 cursor-pointer group overflow-hidden rounded-3xl corner-squircle">
      {/* Background image */}
      <img
        src={recipe.image_url}
        alt={recipe.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
      />

      {/* Dimming layer for modal-like focus */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />

      {/* Liquid Glass with material variation based on depth */}
      <div className="absolute inset-0 group-hover:bg-white/5 transition-all duration-700" />

      {/* Surface that grows more opaque on hover (deeper engagement) */}
      <div className="absolute inset-4 group-hover:inset-2 transition-all duration-500 ease-out">
        <div className="h-full p-6 bg-white/5 group-hover:bg-white/10 border border-white/10 group-hover:border-white/20 rounded-3xl corner-squircle shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col justify-between transition-all duration-500">
          {/* Top section */}
          <div className="flex items-start justify-between">
            <Badge variant="recipe" className="bg-white/20 border-white/30 text-white">
              {categoryLabel}
            </Badge>
            <div className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">
              {recipe.steps.length} étapes
            </div>
          </div>

          {/* Bottom section */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-white drop-shadow-lg">
              {recipe.title}
            </h3>
            <div className="flex gap-3">
              <div className="flex-1 h-11 px-4 bg-white/15 hover:bg-white/25 border border-white/25 rounded-full flex items-center justify-center gap-2 text-white transition-all duration-300">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{totalTime} min</span>
              </div>
              <div className="flex-1 h-11 px-4 bg-white/15 hover:bg-white/25 border border-white/25 rounded-full flex items-center justify-center gap-2 text-white transition-all duration-300">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{recipe.servings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Card 10: Continuity & Shared Anatomy Card - Basé sur la continuité cross-platform (lignes 136-146)
function ContinuityCard({ recipe }: { recipe: Recipe }) {
  const categoryLabel = CATEGORIES.find((c) => c.value === recipe.category)?.label || recipe.category
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <div className="bg-white rounded-3xl corner-squircle shadow-ios-md hover:shadow-ios-lg transition-all duration-500 cursor-pointer group overflow-hidden">
      {/* Shared anatomy: Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Selection indicator (shared component behavior) */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-ios-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-5 h-5 rounded-full bg-ios-pink" />
        </div>
      </div>

      {/* Shared anatomy: Content structure */}
      <div className="p-5 space-y-3">
        {/* Shared anatomy: Icon + Label (like menu items) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ios-pink/10 flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-5 h-5 text-ios-pink" />
          </div>
          <div className="flex-1">
            <Badge variant="recipe" className="text-xs">{categoryLabel}</Badge>
          </div>
        </div>

        {/* Shared anatomy: Label/Title */}
        <h3 className="text-lg font-bold text-ios-label line-clamp-2">
          {recipe.title}
        </h3>

        {/* Shared anatomy: Accessory items (like trailing elements in lists) */}
        <div className="flex items-center justify-between pt-2 border-t border-ios-separator">
          <div className="flex items-center gap-2 text-ios-label-secondary text-sm">
            <Clock className="w-4 h-4" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-2 text-ios-label-secondary text-sm">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} pers.</span>
          </div>
          {/* Accessory: Chevron indicator */}
          <div className="w-6 h-6 rounded-full bg-ios-bg flex items-center justify-center">
            <svg className="w-3 h-3 text-ios-label-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DemoCardsPage() {
  return (
    <div className="min-h-screen bg-ios-bg py-12">
      <Container maxWidth="xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-ios-label mb-3">Design System Cards - WWDC 2025 Inspired</h1>
          <p className="text-lg text-ios-label-secondary">Cards de recettes basées sur les principes Liquid Glass et le design system Apple</p>
        </div>

        <div className="space-y-16">
          {/* Concentric Shapes */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Concentric Shapes</h2>
              <p className="text-ios-label-secondary">Concentricité - alignement des rayons et marges autour d'un centre partagé</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map(recipe => <ConcentricCard key={recipe.id} recipe={recipe} />)}
            </div>
          </section>

          {/* Capsule Shapes */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Capsule Shapes</h2>
              <p className="text-ios-label-secondary">Formes capsules - rayon = hauteur/2, pour focus et clarté dans les interfaces tactiles</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map(recipe => <CapsuleCard key={recipe.id} recipe={recipe} />)}
            </div>
          </section>

          {/* Scroll Edge Effects */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Scroll Edge Effects</h2>
              <p className="text-ios-label-secondary">Effets de bord doux et durs pour clarifier où UI et contenu se rencontrent</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map(recipe => <ScrollEdgeCard key={recipe.id} recipe={recipe} />)}
            </div>
          </section>

          {/* Spatial Organization */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Spatial Organization</h2>
              <p className="text-ios-label-secondary">Organisation spatiale - surfaces connectées à leur source de manière spatiale</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map(recipe => <SpatialCard key={recipe.id} recipe={recipe} />)}
            </div>
          </section>

          {/* Material Variation */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Material Variation</h2>
              <p className="text-ios-label-secondary">Variation des matériaux pour refléter la profondeur et l'engagement</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map(recipe => <MaterialVariationCard key={recipe.id} recipe={recipe} />)}
            </div>
          </section>

          {/* Continuity & Shared Anatomy */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Continuity & Shared Anatomy</h2>
              <p className="text-ios-label-secondary">Anatomie partagée pour continuité cross-platform - même structure, comportement familier</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map(recipe => <ContinuityCard key={recipe.id} recipe={recipe} />)}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-ios-separator pt-16">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Designs Originaux</h2>
              <p className="text-ios-label-secondary">Les premières variantes créées</p>
            </div>
          </div>

          {/* Hero Card */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Hero Card</h2>
              <p className="text-ios-label-secondary">Design immersif avec glassmorphism</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map(recipe => <HeroCard key={recipe.id} recipe={recipe} />)}
            </div>
          </section>

          {/* Compact Card */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Compact Card</h2>
              <p className="text-ios-label-secondary">Design épuré avec bouton révélé au survol</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map(recipe => <CompactCard key={recipe.id} recipe={recipe} />)}
            </div>
          </section>

          {/* Minimal Card */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Minimal Card</h2>
              <p className="text-ios-label-secondary">Style magazine minimaliste</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map(recipe => <MinimalCard key={recipe.id} recipe={recipe} />)}
            </div>
          </section>

          {/* Liquid Glass Card */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Liquid Glass Card</h2>
              <p className="text-ios-label-secondary">Effet verre liquide avec dégradés animés</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map(recipe => <LiquidGlassCard key={recipe.id} recipe={recipe} />)}
            </div>
          </section>

          {/* Comparison with RecipeCard variants */}
          <div className="border-t border-ios-separator pt-16">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ios-label mb-2">Variantes RecipeCard</h2>
              <p className="text-ios-label-secondary">Pour comparaison avec le composant RecipeCard</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-ios-label mb-3">Overlay</p>
                <RecipeCard recipe={sampleRecipe} variant="overlay" />
              </div>
              <div>
                <p className="text-sm font-medium text-ios-label mb-3">Compact</p>
                <RecipeCard recipe={sampleRecipe} variant="compact" />
              </div>
              <div>
                <p className="text-sm font-medium text-ios-label mb-3">Default</p>
                <RecipeCard recipe={sampleRecipe} variant="default" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
