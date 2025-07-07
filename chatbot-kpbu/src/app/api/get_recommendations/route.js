import { NextResponse } from 'next/server';

// Sample project data (in real implementation, this would come from a database)
const projects = [
  {
    id: 1,
    name: "Pembangunan Jalan Tol Jakarta-Bandung",
    sector: "Transportation",
    investmentRange: "5000-10000",
    riskLevel: "medium",
    duration: 36,
    location: "Jakarta-Bandung",
    description: "Proyek pembangunan jalan tol yang menghubungkan Jakarta dan Bandung dengan teknologi terkini.",
    tags: ["infrastructure", "transportation", "toll-road"],
    estimatedROI: 12.5,
    governmentSupport: "high",
    marketDemand: "high",
    regulatoryComplexity: "medium"
  },
  {
    id: 2,
    name: "Pembangunan Rumah Sakit Umum Daerah",
    sector: "Healthcare",
    investmentRange: "1000-5000",
    riskLevel: "low",
    duration: 24,
    location: "Surabaya",
    description: "Pembangunan dan operasional rumah sakit umum daerah dengan fasilitas lengkap.",
    tags: ["healthcare", "hospital", "public-service"],
    estimatedROI: 8.5,
    governmentSupport: "high",
    marketDemand: "high",
    regulatoryComplexity: "low"
  },
  {
    id: 3,
    name: "Pembangunan Pelabuhan Logistik",
    sector: "Logistics",
    investmentRange: "10000-20000",
    riskLevel: "high",
    duration: 48,
    location: "Batam",
    description: "Pengembangan pelabuhan logistik modern untuk mendukung perdagangan internasional.",
    tags: ["logistics", "port", "international-trade"],
    estimatedROI: 15.2,
    governmentSupport: "medium",
    marketDemand: "medium",
    regulatoryComplexity: "high"
  },
  {
    id: 4,
    name: "Pembangunan Sistem Pengolahan Air Bersih",
    sector: "Water Management",
    investmentRange: "2000-5000",
    riskLevel: "low",
    duration: 30,
    location: "Medan",
    description: "Sistem pengolahan air bersih untuk memenuhi kebutuhan masyarakat kota Medan.",
    tags: ["water-treatment", "utilities", "public-service"],
    estimatedROI: 9.8,
    governmentSupport: "high",
    marketDemand: "high",
    regulatoryComplexity: "medium"
  },
  {
    id: 5,
    name: "Pembangunan Pusat Energi Terbarukan",
    sector: "Energy",
    investmentRange: "15000-30000",
    riskLevel: "medium",
    duration: 60,
    location: "Bali",
    description: "Pembangunan pusat energi terbarukan dengan teknologi solar dan wind power.",
    tags: ["renewable-energy", "solar", "wind-power"],
    estimatedROI: 18.5,
    governmentSupport: "medium",
    marketDemand: "medium",
    regulatoryComplexity: "medium"
  },
  {
    id: 6,
    name: "Pembangunan Sekolah Tinggi Vokasi",
    sector: "Education",
    investmentRange: "500-1000",
    riskLevel: "low",
    duration: 18,
    location: "Yogyakarta",
    description: "Pembangunan sekolah tinggi vokasi dengan fokus pada teknologi dan industri.",
    tags: ["education", "vocational", "technology"],
    estimatedROI: 7.2,
    governmentSupport: "high",
    marketDemand: "medium",
    regulatoryComplexity: "low"
  },
  {
    id: 7,
    name: "Pembangunan Smart City Infrastructure",
    sector: "Technology",
    investmentRange: "8000-15000",
    riskLevel: "medium",
    duration: 42,
    location: "Semarang",
    description: "Pengembangan infrastruktur smart city dengan IoT dan sistem terintegrasi.",
    tags: ["smart-city", "iot", "technology"],
    estimatedROI: 14.8,
    governmentSupport: "medium",
    marketDemand: "high",
    regulatoryComplexity: "high"
  },
  {
    id: 8,
    name: "Pembangunan Fasilitas Olahraga Nasional",
    sector: "Sports",
    investmentRange: "3000-8000",
    riskLevel: "medium",
    duration: 36,
    location: "Jakarta",
    description: "Pembangunan kompleks fasilitas olahraga untuk event nasional dan internasional.",
    tags: ["sports", "facility", "national-event"],
    estimatedROI: 10.5,
    governmentSupport: "high",
    marketDemand: "medium",
    regulatoryComplexity: "medium"
  }
];

// Helper function to parse investment range
function parseInvestmentRange(range) {
  const [min, max] = range.split('-').map(num => parseInt(num));
  return { min, max };
}

// Helper function to calculate rule-based score
function calculateRuleBasedScore(project, preferences) {
  let score = 0;
  let maxScore = 0;

  // Sector matching (weight: 25%)
  maxScore += 25;
  if (preferences.preferredSectors && preferences.preferredSectors.includes(project.sector)) {
    score += 25;
  }

  // Investment range matching (weight: 20%)
  maxScore += 20;
  if (preferences.investmentRange) {
    const projectRange = parseInvestmentRange(project.investmentRange);
    const preferredRange = parseInvestmentRange(preferences.investmentRange);
    
    // Check if there's overlap in investment ranges
    if (projectRange.min <= preferredRange.max && projectRange.max >= preferredRange.min) {
      score += 20;
    }
  }

  // Risk level matching (weight: 15%)
  maxScore += 15;
  if (preferences.riskTolerance === project.riskLevel) {
    score += 15;
  } else if (
    (preferences.riskTolerance === 'medium' && ['low', 'high'].includes(project.riskLevel)) ||
    (preferences.riskTolerance === 'high' && project.riskLevel === 'medium')
  ) {
    score += 10;
  }

  // Duration matching (weight: 10%)
  maxScore += 10;
  if (preferences.maxDuration && project.duration <= preferences.maxDuration) {
    score += 10;
  }

  // Location preference (weight: 10%)
  maxScore += 10;
  if (preferences.preferredLocations && preferences.preferredLocations.some(loc => 
    project.location.toLowerCase().includes(loc.toLowerCase())
  )) {
    score += 10;
  }

  // ROI expectation (weight: 10%)
  maxScore += 10;
  if (preferences.expectedROI && project.estimatedROI >= preferences.expectedROI) {
    score += 10;
  }

  // Government support preference (weight: 5%)
  maxScore += 5;
  if (preferences.governmentSupportLevel === project.governmentSupport) {
    score += 5;
  }

  // Market demand preference (weight: 5%)
  maxScore += 5;
  if (preferences.marketDemandLevel === project.marketDemand) {
    score += 5;
  }

  return maxScore > 0 ? (score / maxScore) * 100 : 0;
}

// Helper function to calculate content-based score
function calculateContentBasedScore(project, preferences) {
  let score = 0;
  let maxScore = 0;

  // Tags similarity (weight: 40%)
  maxScore += 40;
  if (preferences.interests && preferences.interests.length > 0) {
    const commonTags = project.tags.filter(tag => 
      preferences.interests.some(interest => 
        interest.toLowerCase().includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    );
    score += (commonTags.length / Math.max(preferences.interests.length, project.tags.length)) * 40;
  }

  // Description similarity (weight: 30%)
  maxScore += 30;
  if (preferences.keywords && preferences.keywords.length > 0) {
    const descriptionLower = project.description.toLowerCase();
    const matchingKeywords = preferences.keywords.filter(keyword => 
      descriptionLower.includes(keyword.toLowerCase())
    );
    score += (matchingKeywords.length / preferences.keywords.length) * 30;
  }

  // Project characteristics similarity (weight: 30%)
  maxScore += 30;
  let characteristicsScore = 0;
  let characteristicsCount = 0;

  if (preferences.preferredComplexity) {
    characteristicsCount++;
    if (preferences.preferredComplexity === project.regulatoryComplexity) {
      characteristicsScore += 10;
    }
  }

  if (preferences.sustainabilityFocus) {
    characteristicsCount++;
    const sustainabilityTags = ['renewable-energy', 'water-treatment', 'smart-city'];
    if (project.tags.some(tag => sustainabilityTags.includes(tag))) {
      characteristicsScore += 10;
    }
  }

  if (preferences.technologyFocus) {
    characteristicsCount++;
    const technologyTags = ['technology', 'smart-city', 'iot'];
    if (project.tags.some(tag => technologyTags.includes(tag))) {
      characteristicsScore += 10;
    }
  }

  if (characteristicsCount > 0) {
    score += (characteristicsScore / (characteristicsCount * 10)) * 30;
  }

  return maxScore > 0 ? (score / maxScore) * 100 : 0;
}

// Main recommendation function
function getRecommendations(preferences) {
  const scoredProjects = projects.map(project => {
    const ruleBasedScore = calculateRuleBasedScore(project, preferences);
    const contentBasedScore = calculateContentBasedScore(project, preferences);
    
    // Combine scores with weights (Rule-based: 60%, Content-based: 40%)
    const finalScore = (ruleBasedScore * 0.6) + (contentBasedScore * 0.4);
    
    return {
      ...project,
      scores: {
        ruleBasedScore: Math.round(ruleBasedScore * 100) / 100,
        contentBasedScore: Math.round(contentBasedScore * 100) / 100,
        finalScore: Math.round(finalScore * 100) / 100
      },
      matchReasons: generateMatchReasons(project, preferences)
    };
  });

  // Sort by final score and return top 5
  return scoredProjects
    .sort((a, b) => b.scores.finalScore - a.scores.finalScore)
    .slice(0, 5);
}

// Helper function to generate match reasons
function generateMatchReasons(project, preferences) {
  const reasons = [];

  // Rule-based reasons
  if (preferences.preferredSectors && preferences.preferredSectors.includes(project.sector)) {
    reasons.push(`Sektor ${project.sector} sesuai dengan preferensi Anda`);
  }

  if (preferences.riskTolerance === project.riskLevel) {
    reasons.push(`Tingkat risiko ${project.riskLevel} cocok dengan toleransi risiko Anda`);
  }

  if (preferences.expectedROI && project.estimatedROI >= preferences.expectedROI) {
    reasons.push(`ROI estimasi ${project.estimatedROI}% memenuhi ekspektasi Anda`);
  }

  // Content-based reasons
  if (preferences.interests) {
    const commonTags = project.tags.filter(tag => 
      preferences.interests.some(interest => 
        interest.toLowerCase().includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    );
    if (commonTags.length > 0) {
      reasons.push(`Relevan dengan minat Anda: ${commonTags.join(', ')}`);
    }
  }

  if (project.governmentSupport === 'high') {
    reasons.push('Mendapat dukungan pemerintah yang tinggi');
  }

  if (project.marketDemand === 'high') {
    reasons.push('Permintaan pasar yang tinggi');
  }

  return reasons;
}

// API Route Handler
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse preferences from query parameters
    const preferences = {
      preferredSectors: searchParams.get('sectors') ? searchParams.get('sectors').split(',') : null,
      investmentRange: searchParams.get('investment_range') || null,
      riskTolerance: searchParams.get('risk_tolerance') || 'medium',
      maxDuration: searchParams.get('max_duration') ? parseInt(searchParams.get('max_duration')) : null,
      preferredLocations: searchParams.get('locations') ? searchParams.get('locations').split(',') : null,
      expectedROI: searchParams.get('expected_roi') ? parseFloat(searchParams.get('expected_roi')) : null,
      governmentSupportLevel: searchParams.get('government_support') || null,
      marketDemandLevel: searchParams.get('market_demand') || null,
      interests: searchParams.get('interests') ? searchParams.get('interests').split(',') : null,
      keywords: searchParams.get('keywords') ? searchParams.get('keywords').split(',') : null,
      preferredComplexity: searchParams.get('complexity') || null,
      sustainabilityFocus: searchParams.get('sustainability') === 'true',
      technologyFocus: searchParams.get('technology') === 'true'
    };

    // Get recommendations
    const recommendations = getRecommendations(preferences);

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        preferences: preferences,
        total: recommendations.length,
        algorithm: "Rule-Based & Content-Based Hybrid Matching"
      },
      message: "Rekomendasi proyek berhasil digenerate"
    });

  } catch (error) {
    console.error('Error in get_recommendations API:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Terjadi kesalahan dalam menggenerate rekomendasi',
      data: null
    }, { status: 500 });
  }
}

// POST method for more complex preference data
export async function POST(request) {
  try {
    const preferences = await request.json();
    
    // Validate preferences
    if (!preferences || typeof preferences !== 'object') {
      return NextResponse.json({
        success: false,
        error: 'Invalid preferences data',
        data: null
      }, { status: 400 });
    }

    // Get recommendations
    const recommendations = getRecommendations(preferences);

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        preferences: preferences,
        total: recommendations.length,
        algorithm: "Rule-Based & Content-Based Hybrid Matching"
      },
      message: "Rekomendasi proyek berhasil digenerate"
    });

  } catch (error) {
    console.error('Error in get_recommendations API:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Terjadi kesalahan dalam menggenerate rekomendasi',
      data: null
    }, { status: 500 });
  }
}
