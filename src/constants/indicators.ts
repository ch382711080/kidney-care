export type IndicatorValueType = 'numeric' | 'qualitative' | 'text'

export interface IndicatorCategory {
  code: string
  name: string
  shortName: string
}

export interface Indicator {
  code: string
  name: string
  shortName: string
  categoryCode: string
  valueType: IndicatorValueType
  defaultUnit?: string
  units: string[]
  common?: boolean
  note?: string
}

export const INDICATOR_CATEGORIES: IndicatorCategory[] = [
  { code: 'kidney', name: '肾功能', shortName: '肾功' },
  { code: 'urine', name: '尿液检查', shortName: '尿液' },
  { code: 'biochemistry', name: '血液生化', shortName: '生化' },
  { code: 'blood', name: '血常规', shortName: '血常规' },
  { code: 'immunology', name: '免疫相关', shortName: '免疫' },
  { code: 'liver', name: '肝功能', shortName: '肝功' },
  { code: 'lipid', name: '血脂', shortName: '血脂' },
  { code: 'other', name: '其他检查', shortName: '其他' },
]

export const INDICATORS: Indicator[] = [
  // 肾功能
  {
    code: 'scr',
    name: '血肌酐',
    shortName: 'Scr',
    categoryCode: 'kidney',
    valueType: 'numeric',
    defaultUnit: 'μmol/L',
    units: ['μmol/L', 'mg/dL'],
    common: true,
  },
  {
    code: 'egfr',
    name: '估算肾小球滤过率',
    shortName: 'eGFR',
    categoryCode: 'kidney',
    valueType: 'numeric',
    defaultUnit: 'mL/min/1.73m²',
    units: ['mL/min/1.73m²'],
    common: true,
    note: '以化验单报告值为准，本工具不自动计算。',
  },
  {
    code: 'bun',
    name: '尿素氮',
    shortName: 'BUN',
    categoryCode: 'kidney',
    valueType: 'numeric',
    defaultUnit: 'mmol/L',
    units: ['mmol/L', 'mg/dL'],
  },
  {
    code: 'cystatin_c',
    name: '胱抑素 C',
    shortName: 'Cys-C',
    categoryCode: 'kidney',
    valueType: 'numeric',
    defaultUnit: 'mg/L',
    units: ['mg/L'],
  },

  // 尿液检查
  {
    code: 'urine_protein_qual',
    name: '尿蛋白定性',
    shortName: '尿蛋白',
    categoryCode: 'urine',
    valueType: 'qualitative',
    units: [],
    common: true,
  },
  {
    code: 'urine_blood',
    name: '尿潜血',
    shortName: '潜血',
    categoryCode: 'urine',
    valueType: 'qualitative',
    units: [],
  },
  {
    code: 'urine_rbc',
    name: '尿红细胞',
    shortName: '尿红细胞',
    categoryCode: 'urine',
    valueType: 'numeric',
    defaultUnit: '/HPF',
    units: ['/HPF', '个/μL'],
  },
  {
    code: 'urine_wbc',
    name: '尿白细胞',
    shortName: '尿白细胞',
    categoryCode: 'urine',
    valueType: 'numeric',
    defaultUnit: '/HPF',
    units: ['/HPF', '个/μL'],
  },
  {
    code: 'uacr',
    name: '尿白蛋白肌酐比',
    shortName: 'UACR',
    categoryCode: 'urine',
    valueType: 'numeric',
    defaultUnit: 'mg/g',
    units: ['mg/g', 'mg/mmol'],
    common: true,
    note: '不同单位不自动换算，请按化验单单位记录。',
  },
  {
    code: 'upcr',
    name: '尿蛋白肌酐比',
    shortName: 'UPCR',
    categoryCode: 'urine',
    valueType: 'numeric',
    defaultUnit: 'mg/g',
    units: ['mg/g', 'mg/mmol'],
    common: true,
  },
  {
    code: 'urine_protein_24h',
    name: '24 小时尿蛋白定量',
    shortName: '24h 尿蛋白',
    categoryCode: 'urine',
    valueType: 'numeric',
    defaultUnit: 'g/24h',
    units: ['g/24h', 'mg/24h'],
    common: true,
  },

  // 血液生化
  {
    code: 'albumin',
    name: '血白蛋白',
    shortName: '白蛋白',
    categoryCode: 'biochemistry',
    valueType: 'numeric',
    defaultUnit: 'g/L',
    units: ['g/L', 'g/dL'],
    common: true,
  },
  {
    code: 'total_protein',
    name: '总蛋白',
    shortName: '总蛋白',
    categoryCode: 'biochemistry',
    valueType: 'numeric',
    defaultUnit: 'g/L',
    units: ['g/L', 'g/dL'],
  },
  {
    code: 'uric_acid',
    name: '尿酸',
    shortName: '尿酸',
    categoryCode: 'biochemistry',
    valueType: 'numeric',
    defaultUnit: 'μmol/L',
    units: ['μmol/L', 'mg/dL'],
    common: true,
  },
  {
    code: 'potassium',
    name: '钾',
    shortName: 'K',
    categoryCode: 'biochemistry',
    valueType: 'numeric',
    defaultUnit: 'mmol/L',
    units: ['mmol/L'],
  },
  {
    code: 'sodium',
    name: '钠',
    shortName: 'Na',
    categoryCode: 'biochemistry',
    valueType: 'numeric',
    defaultUnit: 'mmol/L',
    units: ['mmol/L'],
  },
  {
    code: 'chloride',
    name: '氯',
    shortName: 'Cl',
    categoryCode: 'biochemistry',
    valueType: 'numeric',
    defaultUnit: 'mmol/L',
    units: ['mmol/L'],
  },
  {
    code: 'calcium',
    name: '钙',
    shortName: 'Ca',
    categoryCode: 'biochemistry',
    valueType: 'numeric',
    defaultUnit: 'mmol/L',
    units: ['mmol/L', 'mg/dL'],
  },
  {
    code: 'phosphorus',
    name: '磷',
    shortName: 'P',
    categoryCode: 'biochemistry',
    valueType: 'numeric',
    defaultUnit: 'mmol/L',
    units: ['mmol/L', 'mg/dL'],
  },

  // 血常规
  {
    code: 'hemoglobin',
    name: '血红蛋白',
    shortName: 'Hb',
    categoryCode: 'blood',
    valueType: 'numeric',
    defaultUnit: 'g/L',
    units: ['g/L', 'g/dL'],
    common: true,
  },
  {
    code: 'rbc',
    name: '红细胞',
    shortName: 'RBC',
    categoryCode: 'blood',
    valueType: 'numeric',
    defaultUnit: '×10¹²/L',
    units: ['×10¹²/L'],
  },
  {
    code: 'wbc',
    name: '白细胞',
    shortName: 'WBC',
    categoryCode: 'blood',
    valueType: 'numeric',
    defaultUnit: '×10⁹/L',
    units: ['×10⁹/L'],
  },
  {
    code: 'platelet',
    name: '血小板',
    shortName: 'PLT',
    categoryCode: 'blood',
    valueType: 'numeric',
    defaultUnit: '×10⁹/L',
    units: ['×10⁹/L'],
  },

  // 免疫相关
  {
    code: 'iga',
    name: '免疫球蛋白 A',
    shortName: 'IgA',
    categoryCode: 'immunology',
    valueType: 'numeric',
    defaultUnit: 'g/L',
    units: ['g/L', 'mg/dL'],
  },
  {
    code: 'igg',
    name: '免疫球蛋白 G',
    shortName: 'IgG',
    categoryCode: 'immunology',
    valueType: 'numeric',
    defaultUnit: 'g/L',
    units: ['g/L', 'mg/dL'],
  },
  {
    code: 'igm',
    name: '免疫球蛋白 M',
    shortName: 'IgM',
    categoryCode: 'immunology',
    valueType: 'numeric',
    defaultUnit: 'g/L',
    units: ['g/L', 'mg/dL'],
  },
  {
    code: 'c3',
    name: '补体 C3',
    shortName: 'C3',
    categoryCode: 'immunology',
    valueType: 'numeric',
    defaultUnit: 'g/L',
    units: ['g/L', 'mg/dL'],
  },
  {
    code: 'c4',
    name: '补体 C4',
    shortName: 'C4',
    categoryCode: 'immunology',
    valueType: 'numeric',
    defaultUnit: 'g/L',
    units: ['g/L', 'mg/dL'],
  },

  // 肝功能
  {
    code: 'alt',
    name: '丙氨酸氨基转移酶',
    shortName: 'ALT',
    categoryCode: 'liver',
    valueType: 'numeric',
    defaultUnit: 'U/L',
    units: ['U/L'],
  },
  {
    code: 'ast',
    name: '天门冬氨酸氨基转移酶',
    shortName: 'AST',
    categoryCode: 'liver',
    valueType: 'numeric',
    defaultUnit: 'U/L',
    units: ['U/L'],
  },
  {
    code: 'total_bilirubin',
    name: '总胆红素',
    shortName: 'TBIL',
    categoryCode: 'liver',
    valueType: 'numeric',
    defaultUnit: 'μmol/L',
    units: ['μmol/L', 'mg/dL'],
  },

  // 血脂
  {
    code: 'total_cholesterol',
    name: '总胆固醇',
    shortName: 'TC',
    categoryCode: 'lipid',
    valueType: 'numeric',
    defaultUnit: 'mmol/L',
    units: ['mmol/L', 'mg/dL'],
  },
  {
    code: 'triglycerides',
    name: '甘油三酯',
    shortName: 'TG',
    categoryCode: 'lipid',
    valueType: 'numeric',
    defaultUnit: 'mmol/L',
    units: ['mmol/L', 'mg/dL'],
  },
  {
    code: 'ldl_c',
    name: '低密度脂蛋白胆固醇',
    shortName: 'LDL-C',
    categoryCode: 'lipid',
    valueType: 'numeric',
    defaultUnit: 'mmol/L',
    units: ['mmol/L', 'mg/dL'],
  },
  {
    code: 'hdl_c',
    name: '高密度脂蛋白胆固醇',
    shortName: 'HDL-C',
    categoryCode: 'lipid',
    valueType: 'numeric',
    defaultUnit: 'mmol/L',
    units: ['mmol/L', 'mg/dL'],
  },

  // 其他检查
  {
    code: 'kidney_ultrasound',
    name: '肾脏 B 超',
    shortName: '肾脏 B 超',
    categoryCode: 'other',
    valueType: 'text',
    units: [],
  },
  {
    code: 'biopsy_pathology',
    name: '肾穿刺病理',
    shortName: '肾穿刺',
    categoryCode: 'other',
    valueType: 'text',
    units: [],
  },
  {
    code: 'other',
    name: '其他检查项目',
    shortName: '其他',
    categoryCode: 'other',
    valueType: 'text',
    units: [],
  },
]

const indicatorMap = new Map(INDICATORS.map((indicator) => [indicator.code, indicator]))

const categoryMap = new Map(INDICATOR_CATEGORIES.map((category) => [category.code, category]))

export function getIndicator(code: string): Indicator | undefined {
  return indicatorMap.get(code)
}

export function getIndicatorCategory(code: string): IndicatorCategory | undefined {
  return categoryMap.get(code)
}

export function getIndicatorsByCategory(categoryCode: string): Indicator[] {
  return INDICATORS.filter((indicator) => indicator.categoryCode === categoryCode)
}

export const COMMON_INDICATORS: Indicator[] = INDICATORS.filter((indicator) => indicator.common)

export const COMMON_INDICATOR_CODES: string[] = COMMON_INDICATORS.map(
  (indicator) => indicator.code,
)

export const TREND_INDICATOR_CODES = [
  'scr',
  'egfr',
  'urine_protein_24h',
  'uacr',
  'upcr',
  'uric_acid',
  'albumin',
] as const
