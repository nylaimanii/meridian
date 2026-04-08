import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  { id: 'patient', icon: '🧑‍⚕️', label: 'Patient', desc: 'Looking for treatment options for myself' },
  { id: 'caregiver', icon: '🤝', label: 'Caregiver', desc: 'Helping someone I love find options' },
  { id: 'professional', icon: '👩‍⚕️', label: 'Medical Professional', desc: 'Exploring trials for my patients' },
];

const CONDITION_CATEGORIES = [
  { label: 'Cancer', conditions: ['Breast Cancer', 'Lung Cancer', 'Prostate Cancer', 'Colorectal Cancer', 'Leukemia', 'Lymphoma', 'Melanoma', 'Ovarian Cancer', 'Brain Tumor', 'Bladder Cancer', 'Pancreatic Cancer', 'Thyroid Cancer'] },
  { label: 'Heart & Vascular', conditions: ['Heart Disease', 'Heart Failure', 'Hypertension', 'Stroke', 'Atrial Fibrillation', 'Coronary Artery Disease', 'Peripheral Artery Disease'] },
  { label: 'Brain & Nervous System', conditions: ["Alzheimer's Disease", "Parkinson's Disease", 'Multiple Sclerosis', 'Epilepsy', 'ALS', 'Migraine', 'Neuropathy', 'Dementia', 'Traumatic Brain Injury'] },
  { label: 'Mental Health', conditions: ['Depression', 'Anxiety', 'Bipolar Disorder', 'Schizophrenia', 'PTSD', 'OCD', 'ADHD', 'Eating Disorders', 'Autism Spectrum'] },
  { label: 'Metabolic & Endocrine', conditions: ['Type 1 Diabetes', 'Type 2 Diabetes', 'Obesity', 'Thyroid Disease', 'Metabolic Syndrome'] },
  { label: 'Respiratory', conditions: ['Asthma', 'COPD', 'Pulmonary Fibrosis', 'Sleep Apnea', 'Cystic Fibrosis', 'Pulmonary Hypertension'] },
  { label: 'Digestive', conditions: ["Crohn's Disease", 'Ulcerative Colitis', 'IBS', 'Celiac Disease', 'GERD', 'Liver Disease'] },
  { label: 'Musculoskeletal', conditions: ['Rheumatoid Arthritis', 'Osteoarthritis', 'Osteoporosis', 'Lupus', 'Fibromyalgia', 'Gout'] },
  { label: 'Blood & Immune', conditions: ['Sickle Cell Disease', 'Hemophilia', 'HIV/AIDS', 'Anemia', 'Immune Deficiency'] },
  { label: 'Skin', conditions: ['Psoriasis', 'Eczema', 'Vitiligo', 'Alopecia'] },
  { label: 'Eye & Ear', conditions: ['Glaucoma', 'Macular Degeneration', 'Cataracts', 'Hearing Loss'] },
  { label: "Women's Health", conditions: ['Endometriosis', 'PCOS', 'Uterine Fibroids', 'Infertility', 'Menopause'] },
  { label: "Men's Health", conditions: ['Erectile Dysfunction', 'Benign Prostatic Hyperplasia'] },
  { label: 'Pediatric', conditions: ['Childhood Asthma', 'Juvenile Diabetes', 'Pediatric Cancer', 'Growth Disorders'] },
  { label: 'Other', conditions: ['Chronic Pain', 'Rare Disease', 'Healthy Volunteer', 'Other Condition'] },
];

const AGE_RANGES = ['Under 18', '18–29', '30–44', '45–59', '60–74', '75+'];

function chipStyle(selected) {
  return {
    padding: '7px 14px',
    borderRadius: '999px',
    border: selected ? '1px solid var(--color-primary-bright)' : '1px solid var(--color-border)',
    background: selected ? 'rgba(71,197,245,0.12)' : 'var(--color-bg-3)',
    color: selected ? 'var(--color-primary-bright)' : 'var(--color-text-muted)',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.12s ease',
  };
}

function primaryBtn(enabled) {
  return {
    flex: 1,
    padding: '13px 20px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: enabled ? 'var(--color-primary)' : 'var(--color-bg-3)',
    color: enabled ? 'white' : 'var(--color-text-muted)',
    fontSize: '15px',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: enabled ? 'pointer' : 'not-allowed',
    transition: 'all 0.15s ease',
  };
}

const ghostBtn = {
  padding: '13px 20px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  background: 'transparent',
  color: 'var(--color-text-muted)',
  fontSize: '15px',
  fontFamily: 'var(--font-body)',
  cursor: 'pointer',
};

export function DemoIntakeForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [conditionSearch, setConditionSearch] = useState('');
  const [ageRange, setAgeRange] = useState(null);
  const [inTreatment, setInTreatment] = useState(null);

  const filteredCategories = useMemo(() => {
    const q = conditionSearch.trim().toLowerCase();
    if (!q) return CONDITION_CATEGORIES;
    const all = CONDITION_CATEGORIES.flatMap((c) => c.conditions).filter((cond) =>
      cond.toLowerCase().includes(q)
    );
    return [{ label: null, conditions: all }];
  }, [conditionSearch]);

  function toggleCondition(cond) {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', padding: '0 16px 40px' }}>
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: '99px',
              background: i <= step ? 'var(--color-primary-bright)' : 'var(--color-border)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 0: Role ── */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,4vw,26px)', color: 'var(--color-text)', lineHeight: 1.25, marginBottom: '6px' }}>
                who are you searching for?
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                helps us personalize your results
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '18px 20px',
                    borderRadius: 'var(--radius-card)',
                    border: role === r.id ? '1px solid var(--color-primary-bright)' : '1px solid var(--color-border)',
                    background: role === r.id ? 'rgba(71,197,245,0.08)' : 'var(--color-bg-2)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize: '15px', color: 'var(--color-text)', fontWeight: 500 }}>{r.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { if (role) setStep(1); }}
                style={primaryBtn(!!role)}
              >
                continue →
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 1: Conditions ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,4vw,26px)', color: 'var(--color-text)', lineHeight: 1.25, marginBottom: '6px' }}>
                what conditions are relevant?
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                select all that apply
              </div>
            </div>
            {selectedConditions.length > 0 && (
              <div style={{ fontSize: '12px', color: 'var(--color-primary-bright)' }}>
                {selectedConditions.length} selected
              </div>
            )}
            <input
              type="text"
              placeholder="search conditions..."
              value={conditionSearch}
              onChange={(e) => setConditionSearch(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-3)',
                color: 'var(--color-text)',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
              }}
            />
            <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
              {filteredCategories.map((cat, ci) => (
                <div key={ci}>
                  {cat.label && (
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      {cat.label}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {cat.conditions.map((cond) => (
                      <button key={cond} onClick={() => toggleCondition(cond)} style={chipStyle(selectedConditions.includes(cond))}>
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(0)} style={ghostBtn}>back</button>
              <button onClick={() => setStep(2)} style={primaryBtn(true)}>continue →</button>
            </div>
            <button
              onClick={() => setStep(2)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'center' }}
            >
              skip this step
            </button>
          </motion.div>
        )}

        {/* ── Step 2: Age + Treatment ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,4vw,26px)', color: 'var(--color-text)', lineHeight: 1.25, marginBottom: '6px' }}>
                a bit more about you
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                helps filter trials by eligibility
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                age range
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {AGE_RANGES.map((range) => (
                  <button key={range} onClick={() => setAgeRange(range)} style={chipStyle(ageRange === range)}>
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '20px', marginBottom: '10px' }}>
                currently in treatment?
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Yes, actively in treatment', 'No / Not currently'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setInTreatment(opt)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: inTreatment === opt ? '1px solid var(--color-primary-bright)' : '1px solid var(--color-border)',
                      background: inTreatment === opt ? 'rgba(71,197,245,0.12)' : 'var(--color-bg-2)',
                      color: inTreatment === opt ? 'var(--color-primary-bright)' : 'var(--color-text-muted)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      textAlign: 'center',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(1)} style={ghostBtn}>back</button>
              <button
                onClick={() => {
                  if (ageRange && inTreatment) {
                    onSubmit({ role, conditions: selectedConditions, ageRange, inTreatment });
                  }
                }}
                style={primaryBtn(!!(ageRange && inTreatment))}
              >
                find my trials →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
