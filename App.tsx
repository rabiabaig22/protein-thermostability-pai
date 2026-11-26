
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import meltomeData from './meltome_results.json';

type TabKey = 'overview' | 'calibration' | 'coefficients';

const TOKENS = {
  paper: '#F7F6F2',
  surface: '#FFFFFF',
  ink: '#18181B',
  muted: '#52525B',
  rule: '#D4D2C8',
  ruleStrong: '#18181B',
  accentPrimary: '#1E3A2F',
  accentWarm: '#B45309',
  negative: '#991B1B',
  positive: '#1E3A2F',
  serif: 'Georgia, "Times New Roman", serif',
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

// Updated validation results from the completed analysis.
// These are displayed results, not new model calculations.
const VALIDATION_RESULTS = {
  meanCalibrationGap: 2.7276,
  coverage50: 57.0689,
  coverage80: 82.5436,
  coverage90: 90.1976,
  coverage95: 93.8999,
  sigmaMean: 8.0627,
  sigmaLow: 7.9954,
  sigmaHigh: 8.1329,
  mahalanobisEpistemicCorrelation: 0.9992,
};

const CALIBRATION_RESULTS = [
  {
    nominal_pct: 50,
    observed_pct: 57.0689,
    gap_pct: 7.0689,
    avg_width_c: 10.8728,
  },
  {
    nominal_pct: 80,
    observed_pct: 82.5436,
    gap_pct: 2.5436,
    avg_width_c: 20.6495,
  },
  {
    nominal_pct: 90,
    observed_pct: 90.1976,
    gap_pct: 0.1976,
    avg_width_c: 26.5030,
  },
  {
    nominal_pct: 95,
    observed_pct: 93.8999,
    gap_pct: 1.1001,
    avg_width_c: 31.5682,
  },
];

const DISTANCE_COVERAGE = [
  { quartile: 'Q1 closest', coverage90: 96.626 },
  { quartile: 'Q2', coverage90: 92.632 },
  { quartile: 'Q3', coverage90: 87.874 },
  { quartile: 'Q4 farthest', coverage90: 83.653 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [sortByAbs, setSortByAbs] = useState<boolean>(true);
  const [selectedInterval, setSelectedInterval] = useState<number>(90);

  const selectedCal = useMemo(
    () =>
      CALIBRATION_RESULTS.find(
        (row) => row.nominal_pct === selectedInterval,
      ) ?? CALIBRATION_RESULTS[2],
    [selectedInterval],
  );

  const sortedCoefs = useMemo(() => {
    const rows = meltomeData.coefficients.filter(
      (c) => !c.feature.startsWith('beta_0'),
    );

    return [...rows].sort((a, b) =>
      sortByAbs
        ? Math.abs(b.post_mean) - Math.abs(a.post_mean)
        : a.feature.localeCompare(b.feature),
    );
  }, [sortByAbs]);

  const modelComparison = useMemo(
    () => [
      {
        metric: 'Validation MAE (°C)',
        Bayesian: meltomeData.metrics.bayes_mae,
        OLS: meltomeData.metrics.ols_mae,
      },
      {
        metric: 'Validation RMSE (°C)',
        Bayesian: meltomeData.metrics.bayes_rmse,
        OLS: meltomeData.metrics.ols_rmse,
      },
    ],
    [],
  );

  const q1 = meltomeData.quartiles[0];
  const q4 = meltomeData.quartiles[3];

  return (
    <div
      style={{
        backgroundColor: TOKENS.paper,
        color: TOKENS.ink,
        minHeight: '100vh',
        fontFamily: TOKENS.sans,
        fontSize: '16px',
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          maxWidth: '1040px',
          margin: '0 auto',
          padding: '40px 24px 64px',
        }}
      >
        <header
          style={{
            borderTop: `3px solid ${TOKENS.ruleStrong}`,
            borderBottom: `1px solid ${TOKENS.ruleStrong}`,
            padding: '24px 0 28px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: TOKENS.accentPrimary,
              }}
            >
              Stanford Probability for AI - Final Study
            </span>

            <span
              style={{
                fontFamily: TOKENS.mono,
                fontSize: '13px',
                color: TOKENS.muted,
              }}
            >
              DATASET: TMPROT (ZENODO 24504578) | TEST SET: LOCKED (N ={' '}
              {meltomeData.dataset.locked_test_n.toLocaleString()})
            </span>
          </div>

          <h1
            style={{
              fontFamily: TOKENS.serif,
              fontWeight: 700,
              fontSize: '36px',
              lineHeight: 1.15,
              letterSpacing: '-0.015em',
              margin: '0 0 18px',
              maxWidth: '780px',
            }}
          >
            Bayesian Linear Regression for Protein Melting Temperature and
            Out-of-Distribution Uncertainty
          </h1>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              paddingTop: '14px',
              borderTop: `1px solid ${TOKENS.rule}`,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: TOKENS.muted,
                  marginBottom: '4px',
                }}
              >
                Research Question
              </div>

              <p style={{ margin: 0, fontSize: '16px' }}>
                How accurately does Bayesian linear regression predict protein
                T<sub>m</sub> from amino acid composition and sequence length,
                and how reliable are its uncertainty intervals for sequences
                distant from the training distribution?
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: TOKENS.muted,
                  marginBottom: '4px',
                }}
              >
                Pre-Evaluation Hypothesis
              </div>

              <p style={{ margin: 0, fontSize: '16px' }}>
                <strong>{meltomeData.initial_belief_pct}% prior confidence</strong>{' '}
                that Bayesian regression matches OLS point accuracy while
                adding practical value by flagging high-distance,
                low-confidence sequences.
              </p>
            </div>
          </div>
        </header>

        <section
          aria-label="Key validation figures"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            borderBottom: `1px solid ${TOKENS.ruleStrong}`,
            paddingBottom: '24px',
            marginBottom: '32px',
            gap: '20px',
          }}
        >
          <div
            style={{
              borderLeft: `3px solid ${TOKENS.accentPrimary}`,
              paddingLeft: '14px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: TOKENS.muted,
              }}
            >
              Validation MAE / RMSE
            </div>

            <div
              style={{
                fontFamily: TOKENS.mono,
                fontSize: '26px',
                fontWeight: 700,
                marginTop: '4px',
              }}
            >
              {meltomeData.metrics.bayes_mae} /{' '}
              {meltomeData.metrics.bayes_rmse} °C
            </div>

            <div style={{ fontSize: '13px', color: TOKENS.muted }}>
              OLS: {meltomeData.metrics.ols_mae} /{' '}
              {meltomeData.metrics.ols_rmse} °C
            </div>
          </div>

          <div
            style={{
              borderLeft: `3px solid ${TOKENS.accentWarm}`,
              paddingLeft: '14px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: TOKENS.muted,
              }}
            >
              Mean Log10 Likelihood
            </div>

            <div
              style={{
                fontFamily: TOKENS.mono,
                fontSize: '26px',
                fontWeight: 700,
                marginTop: '4px',
              }}
            >
              {meltomeData.metrics.bayes_score_log10}
            </div>

            <div style={{ fontSize: '13px', color: TOKENS.muted }}>
              OLS score: {meltomeData.metrics.ols_score_log10}
            </div>
          </div>

          <div
            style={{
              borderLeft: `3px solid ${TOKENS.accentPrimary}`,
              paddingLeft: '14px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: TOKENS.muted,
              }}
            >
              Mean Calibration Gap
            </div>

            <div
              style={{
                fontFamily: TOKENS.mono,
                fontSize: '26px',
                fontWeight: 700,
                marginTop: '4px',
              }}
            >
              {VALIDATION_RESULTS.meanCalibrationGap.toFixed(4)} pp
            </div>

            <div style={{ fontSize: '13px', color: TOKENS.muted }}>
              90% coverage: {VALIDATION_RESULTS.coverage90.toFixed(4)}%
            </div>
          </div>

          <div
            style={{
              borderLeft: `3px solid ${TOKENS.accentWarm}`,
              paddingLeft: '14px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: TOKENS.muted,
              }}
            >
              Mahalanobis Distance vs. Epistemic SD
            </div>

            <div
              style={{
                fontFamily: TOKENS.mono,
                fontSize: '26px',
                fontWeight: 700,
                marginTop: '4px',
              }}
            >
              r = {VALIDATION_RESULTS.mahalanobisEpistemicCorrelation.toFixed(4)}
            </div>

            <div style={{ fontSize: '13px', color: TOKENS.muted }}>
              Residual sigma = {VALIDATION_RESULTS.sigmaMean.toFixed(4)} °C
            </div>
          </div>
        </section>

        <section
          aria-label="Generative model specification"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 280px) 1fr',
            gap: '24px',
            borderBottom: `1px solid ${TOKENS.rule}`,
            paddingBottom: '26px',
            marginBottom: '28px',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: TOKENS.serif,
                fontSize: '20px',
                margin: '0 0 6px',
              }}
            >
              Generative Model
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: TOKENS.muted,
              }}
            >
              Conjugate Bayesian linear regression estimated using 8,000 Gibbs
              iterations, 2,000 burn-in iterations, and thinning by 2,
              retaining 3,000 posterior samples.
            </p>
          </div>

          <div style={{ fontSize: '16px' }}>
            <p style={{ margin: '0 0 10px' }}>
              Each protein&apos;s melting temperature T<sub>i</sub> is modeled
              as Normal(beta_0 + x<sub>i</sub><sup>T</sup>beta, sigma
              <sup>2</sup>). Predictors comprise 19 renormalized standard
              amino acid proportions, excluding selenocysteine U as a
              standalone predictor and omitting Leucine L as the reference
              category, plus standardized ln(Length).
            </p>

            <p
              style={{
                margin: 0,
                fontFamily: TOKENS.mono,
                fontSize: '14px',
                backgroundColor: TOKENS.surface,
                border: `1px solid ${TOKENS.rule}`,
                padding: '10px 14px',
              }}
            >
              Priors: beta_0 ~ N(50, 15^2) | beta_j ~ N(0, 2.5^2) |
              sigma^2 ~ InvGamma(2, 50) → posterior sigma ={' '}
              {VALIDATION_RESULTS.sigmaMean.toFixed(4)} °C [
              {VALIDATION_RESULTS.sigmaLow.toFixed(4)}, {VALIDATION_RESULTS.sigmaHigh.toFixed(4)}]
            </p>
          </div>
        </section>

        <nav
          aria-label="Analysis views"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            borderBottom: `2px solid ${TOKENS.ruleStrong}`,
            marginBottom: '28px',
            gap: '4px',
          }}
        >
          {[
            { id: 'overview', label: '01. Predictive Accuracy' },
            { id: 'calibration', label: '02. Calibration & Distance' },
            { id: 'coefficients', label: '03. Posterior Effects' },
          ].map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabKey)}
                aria-pressed={active}
                style={{
                  fontFamily: TOKENS.mono,
                  fontSize: '14px',
                  fontWeight: active ? 700 : 500,
                  padding: '10px 18px',
                  border: 'none',
                  borderBottom: active
                    ? `4px solid ${TOKENS.accentWarm}`
                    : '4px solid transparent',
                  backgroundColor: active ? TOKENS.surface : 'transparent',
                  color: active ? TOKENS.ink : TOKENS.muted,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {activeTab === 'overview' && (
          <section
            aria-label="Validation accuracy and score"
            style={{
              backgroundColor: TOKENS.surface,
              border: `1px solid ${TOKENS.rule}`,
              padding: '28px',
              marginBottom: '32px',
            }}
          >
            <div style={{ maxWidth: '720px', marginBottom: '20px' }}>
              <h2
                style={{
                  fontFamily: TOKENS.serif,
                  fontSize: '24px',
                  margin: '0 0 8px',
                }}
              >
                Bayesian vs. OLS Validation Performance (n ={' '}
                {meltomeData.dataset.val_n.toLocaleString()})
              </h2>

              <p style={{ margin: 0, color: TOKENS.muted }}>
                With {meltomeData.dataset.train_n.toLocaleString()} training
                sequences, Bayesian regression and OLS produce nearly
                identical point predictions. Bayesian validation MAE is{' '}
                {meltomeData.metrics.bayes_mae} °C and RMSE is{' '}
                {meltomeData.metrics.bayes_rmse} °C, compared with OLS MAE of{' '}
                {meltomeData.metrics.ols_mae} °C and RMSE of{' '}
                {meltomeData.metrics.ols_rmse} °C. The Bayesian model also
                provides a posterior predictive distribution.
              </p>
            </div>

            <div
              role="img"
              aria-label="Bar chart comparing Bayesian and OLS validation MAE and RMSE"
              style={{ width: '100%', height: '300px' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={modelComparison}
                  margin={{ top: 12, right: 24, bottom: 12, left: 4 }}
                  barGap={12}
                >
                  <CartesianGrid
                    strokeDasharray="2 4"
                    stroke="#E4E4E7"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="metric"
                    tick={{ fontSize: 14, fill: TOKENS.ink }}
                    axisLine={{ stroke: TOKENS.ruleStrong }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 13, fill: TOKENS.muted }}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: TOKENS.surface,
                      border: `1px solid ${TOKENS.ruleStrong}`,
                      borderRadius: 0,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                  <Bar
                    dataKey="Bayesian"
                    fill={TOKENS.accentPrimary}
                    barSize={44}
                  />
                  <Bar dataKey="OLS" fill={TOKENS.accentWarm} barSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {activeTab === 'calibration' && (
          <section
            aria-label="Calibration and distance analysis"
            style={{
              backgroundColor: TOKENS.surface,
              border: `1px solid ${TOKENS.rule}`,
              padding: '28px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ maxWidth: '640px' }}>
                <h2
                  style={{
                    fontFamily: TOKENS.serif,
                    fontSize: '24px',
                    margin: '0 0 8px',
                  }}
                >
                  Predictive Interval Calibration &amp; Feature Distance
                </h2>

                <p style={{ margin: 0, color: TOKENS.muted }}>
                  Average absolute calibration gap across 50%, 80%, 90%, and
                  95% intervals is{' '}
                  {VALIDATION_RESULTS.meanCalibrationGap.toFixed(4)} percentage
                  points. The 90% interval achieves{' '}
                  {VALIDATION_RESULTS.coverage90.toFixed(4)}% empirical
                  coverage, while the 50% interval achieves{' '}
                  {VALIDATION_RESULTS.coverage50.toFixed(4)}%.
                </p>
              </div>

              <div>
                <label
                  htmlFor="interval-select"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: TOKENS.muted,
                    marginBottom: '4px',
                  }}
                >
                  Nominal Interval
                </label>

                <select
                  id="interval-select"
                  value={selectedInterval}
                  onChange={(e) =>
                    setSelectedInterval(Number(e.target.value))
                  }
                  style={{
                    fontFamily: TOKENS.mono,
                    fontSize: '14px',
                    padding: '8px 12px',
                    border: `1px solid ${TOKENS.ruleStrong}`,
                    backgroundColor: TOKENS.paper,
                    color: TOKENS.ink,
                  }}
                >
                  {CALIBRATION_RESULTS.map((row) => (
                    <option key={row.nominal_pct} value={row.nominal_pct}>
                      {row.nominal_pct}% Interval
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              style={{
                borderLeft: `3px solid ${TOKENS.accentWarm}`,
                backgroundColor: TOKENS.paper,
                padding: '12px 16px',
                marginBottom: '22px',
                fontFamily: TOKENS.mono,
                fontSize: '14px',
              }}
            >
              Selected {selectedCal.nominal_pct}% interval → Observed
              coverage: <strong>{selectedCal.observed_pct.toFixed(4)}%</strong>{' '}
              | Absolute gap: <strong>{selectedCal.gap_pct.toFixed(4)} pp</strong>{' '}
              | Mean width: <strong>{selectedCal.avg_width_c.toFixed(4)} °C</strong>
            </div>

            <div
              role="img"
              aria-label="Bar chart of nominal versus observed predictive coverage"
              style={{ width: '100%', height: '280px', marginBottom: '28px' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CALIBRATION_RESULTS}
                  margin={{ top: 10, right: 24, bottom: 12, left: 4 }}
                  barGap={10}
                >
                  <CartesianGrid
                    strokeDasharray="2 4"
                    stroke="#E4E4E7"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="nominal_pct"
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 14, fill: TOKENS.ink }}
                    axisLine={{ stroke: TOKENS.ruleStrong }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 13, fill: TOKENS.muted }}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(val: number) => `${Number(val).toFixed(4)}%`}
                    contentStyle={{
                      backgroundColor: TOKENS.surface,
                      border: `1px solid ${TOKENS.ruleStrong}`,
                      borderRadius: 0,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '14px' }} />
                  <Bar
                    dataKey="nominal_pct"
                    name="Nominal (%)"
                    fill="#A1A1AA"
                    barSize={36}
                  />
                  <Bar
                    dataKey="observed_pct"
                    name="Observed (%)"
                    fill={TOKENS.accentPrimary}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <h3
              style={{
                fontFamily: TOKENS.serif,
                fontSize: '19px',
                margin: '0 0 6px',
              }}
            >
              Uncertainty Quartiles vs. Mahalanobis Distance
            </h3>

            <p
              style={{
                margin: '0 0 14px',
                fontSize: '15px',
                color: TOKENS.muted,
              }}
            >
              Epistemic SD increases from {q1.mean_epistemic_sd.toFixed(4)} °C
              in Q1 to {q4.mean_epistemic_sd.toFixed(4)} °C in Q4, while mean
              Mahalanobis distance increases from{' '}
              {q1.mean_mahal_dist.toFixed(4)} to{' '}
              {q4.mean_mahal_dist.toFixed(4)}. MAE also increases from{' '}
              {q1.mae.toFixed(4)} °C to {q4.mae.toFixed(4)} °C. However, total
              predictive SD remains nearly constant because residual noise
              dominates. The 90% interval coverage falls from 96.63% in the
              closest quartile to 83.65% in the farthest quartile. This
              indicates heterogeneous calibration. Geometric distance
              reflects feature-space divergence, not necessarily biological
              novelty.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderTop: `2px solid ${TOKENS.ruleStrong}`,
                      borderBottom: `1px solid ${TOKENS.ruleStrong}`,
                      textAlign: 'left',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    <th style={{ padding: '10px 8px' }}>Quartile</th>
                    <th style={{ padding: '10px 8px' }}>Total Pred SD</th>
                    <th style={{ padding: '10px 8px' }}>Epistemic SD</th>
                    <th style={{ padding: '10px 8px' }}>Mahalanobis Dist</th>
                    <th style={{ padding: '10px 8px' }}>Validation MAE</th>
                    <th style={{ padding: '10px 8px' }}>90% Coverage</th>
                  </tr>
                </thead>

                <tbody>
                  {meltomeData.quartiles.map((q, index) => (
                    <tr
                      key={q.quartile}
                      style={{ borderBottom: `1px solid ${TOKENS.rule}` }}
                    >
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>
                        {q.quartile}
                      </td>
                      <td
                        style={{
                          padding: '10px 8px',
                          fontFamily: TOKENS.mono,
                        }}
                      >
                        {Number(q.mean_pred_sd).toFixed(4)} °C
                      </td>
                      <td
                        style={{
                          padding: '10px 8px',
                          fontFamily: TOKENS.mono,
                        }}
                      >
                        {Number(q.mean_epistemic_sd).toFixed(4)} °C
                      </td>
                      <td
                        style={{
                          padding: '10px 8px',
                          fontFamily: TOKENS.mono,
                        }}
                      >
                        {Number(q.mean_mahal_dist).toFixed(4)}
                      </td>
                      <td
                        style={{
                          padding: '10px 8px',
                          fontFamily: TOKENS.mono,
                        }}
                      >
                        {Number(q.mae).toFixed(4)} °C
                      </td>
                      <td
                        style={{
                          padding: '10px 8px',
                          fontFamily: TOKENS.mono,
                          fontWeight: 600,
                          color:
                            index === 3 ? TOKENS.negative : TOKENS.ink,
                        }}
                      >
                        {DISTANCE_COVERAGE[index].coverage90.toFixed(3)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p
              style={{
                margin: '14px 0 0',
                fontSize: '13px',
                color: TOKENS.muted,
              }}
            >
              Coverage is the proportion of validation observations contained
              within the nominal 90% predictive intervals for each distance
              quartile. Values below 90% indicate undercoverage.
            </p>
          </section>
        )}

        {activeTab === 'coefficients' && (
          <section
            aria-label="Posterior regression weights"
            style={{
              backgroundColor: TOKENS.surface,
              border: `1px solid ${TOKENS.rule}`,
              padding: '28px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '18px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: TOKENS.serif,
                    fontSize: '24px',
                    margin: '0 0 4px',
                  }}
                >
                  Posterior Mean Effects (per +1 SD, Reference = Leucine L)
                </h2>

                <p
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    color: TOKENS.muted,
                  }}
                >
                  Shift in predicted melting temperature (°C) relative to
                  baseline composition. These are conditional associations,
                  not causal effects.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSortByAbs((prev) => !prev)}
                style={{
                  fontFamily: TOKENS.mono,
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '8px 14px',
                  border: `1px solid ${TOKENS.ruleStrong}`,
                  backgroundColor: TOKENS.paper,
                  color: TOKENS.ink,
                  cursor: 'pointer',
                }}
              >
                ORDER: {sortByAbs ? 'MAGNITUDE |BETA|' : 'ALPHABETICAL'}
              </button>
            </div>

            <div
              role="img"
              aria-label="Horizontal bar chart of posterior mean regression weights"
              style={{ width: '100%', height: '440px' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedCoefs}
                  layout="vertical"
                  margin={{ top: 8, right: 24, bottom: 8, left: 64 }}
                >
                  <CartesianGrid
                    strokeDasharray="2 4"
                    stroke="#E4E4E7"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 13, fill: TOKENS.muted }}
                    axisLine={{ stroke: TOKENS.ruleStrong }}
                  />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    width={110}
                    tick={{ fontSize: 13, fill: TOKENS.ink }}
                    axisLine={false}
                  />
                  <ReferenceLine x={0} stroke={TOKENS.ruleStrong} />
                  <Tooltip
                    formatter={(val: number) => `${val} °C`}
                    contentStyle={{
                      backgroundColor: TOKENS.surface,
                      border: `1px solid ${TOKENS.ruleStrong}`,
                      borderRadius: 0,
                    }}
                  />
                  <Bar
                    dataKey="post_mean"
                    name="Posterior Mean (°C)"
                    barSize={14}
                  >
                    {sortedCoefs.map((entry) => (
                      <Cell
                        key={entry.feature}
                        fill={
                          entry.post_mean >= 0
                            ? TOKENS.positive
                            : TOKENS.negative
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        <footer
          style={{
            borderTop: `1px solid ${TOKENS.ruleStrong}`,
            paddingTop: '16px',
            fontSize: '14px',
            color: TOKENS.muted,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <span>
            Source: TmProt (
            <a
              href={meltomeData.dataset.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: TOKENS.ink, fontWeight: 600 }}
            >
              Zenodo Record 24504578
            </a>
            ) — Train n = {meltomeData.dataset.train_n.toLocaleString()}, Val
            n = {meltomeData.dataset.val_n.toLocaleString()}.
          </span>

          <span style={{ fontFamily: TOKENS.mono }}>
            Test split ({meltomeData.dataset.locked_test_n.toLocaleString()}{' '}
            rows) locked.
          </span>
        </footer>
      </div>
    </div>
  );
}
