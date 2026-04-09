export interface DailyRoutine {
  day: string;
  activity: string;
  products: string[];
}

interface RoutinePreferences {
  concerns?: string[];
  goals?: string[];
  allergies?: string[];
  budgetRange?: 'low' | 'mid' | 'high';
}

export const generateHairRoutine = (hairType: string, preferences?: RoutinePreferences): DailyRoutine[] => {
  // Simplified logic: Maps predicted class (e.g., "Type 4C") to a routine
  const routine: DailyRoutine[] = [
    { day: 'Monday', activity: 'Wash Day', products: ['Sulfate-free Shampoo', 'Deep Conditioner'] },
    { day: 'Tuesday', activity: 'Moisturize', products: ['Leave-in Conditioner', 'Light Oil'] },
    { day: 'Wednesday', activity: 'Low Manipulation', products: [] },
    { day: 'Thursday', activity: 'Refresh', products: ['Water Spray', 'Curl Cream'] },
    { day: 'Friday', activity: 'Protective Style', products: ['Gel/Butter'] },
    { day: 'Saturday', activity: 'Scalp Care', products: ['Tea Tree Oil'] },
    { day: 'Sunday', activity: 'Self-Care / Mask', products: ['Protein Mask'] },
  ];

  // meaningful customization based on hair type
  if (hairType.includes('Straight') || hairType.includes('Type 1')) {
      routine[2].activity = 'Light Wash (Water only)';
      routine[6].products = ['Hydrating Mask (No Protein)'];
  } else if (hairType.includes('Coily') || hairType.includes('Type 4')) {
      routine[1].activity = 'LCO Method (Liquid, Cream, Oil)';
      routine[3].activity = 'Intense Moisture';
  }

  if (preferences?.concerns?.includes('dandruff')) {
    routine[5].activity = 'Scalp Clarify + Massage';
    routine[5].products = ['Anti-dandruff Scalp Serum'];
  }

  if (preferences?.goals?.includes('grow length')) {
    routine[4].products = [...routine[4].products, 'Protective Style Gel'];
  }

  if (preferences?.allergies?.some(a => a.toLowerCase().includes('fragrance'))) {
    routine.forEach(day => {
      day.products = day.products.map(product => `${product} (Fragrance-Free Option)`);
    });
  }

  if (preferences?.budgetRange === 'low') {
    routine.forEach(day => {
      day.products = day.products.slice(0, 1);
    });
  }

  return routine;
};
