# AI notes

- Student defined research question, 75% initial confidence, U renormalization, L baseline omission, ln(Length), priors, and locked test set.
- Python fitted OLS and Gibbs Bayesian linear regression and wrote app/meltome_results.json, app/App.tsx, SOURCES.md, and AI-NOTES.md.## Validation analysis, November 26, 2026

### Model performance

| Metric | OLS | Bayesian |
|---|---:|---:|
| Validation MAE (°C) | 6.1078 | 6.1075 |
| Validation RMSE (°C) | 8.3365 | 8.3363 |
| Validation R² | 0.1262 | 0.1263 |

### Predictive uncertainty

| Nominal coverage | Observed coverage | Mean interval width (°C) |
|---:|---:|---:|
| 50% | 57.07% | 10.87 |
| 80% | 82.54% | 20.65 |
| 90% | 90.20% | 26.50 |
| 95% | 93.90% | 31.57 |

Overall average calibration gap: 2.7276 percentage points.

### Distance analysis

Validation MAE increased across Mahalanobis distance quartiles:

| Group | MAE (°C) |
|---|---:|
| Q1, closest | 4.6372 |
| Q2 | 5.6829 |
| Q3 | 6.5363 |
| Q4, farthest | 7.5748 |

90% interval coverage was 96.63% in Q1 and 83.65% in Q4.

Euclidean distance analysis showed a similar trend.

Distance was calculated using the 20 standardised predictors. It represents feature-space distance, not direct sequence homology or biological novelty.

### Prior sensitivity

Tested coefficient prior standard deviations of 1.0, 2.5, and 5.0. Predictive performance changed negligibly across these settings.

### Interpretation and limitations

Bayesian regression produced almost identical point predictions to OLS. Epistemic uncertainty increased with feature-space distance, but total predictive uncertainty remained approximately constant because residual noise dominated.

Prediction errors increased for observations farther from the training distribution. Overall interval coverage was close to nominal, but coverage varied across distance groups.

The target Tm is derived from thermal profiling measurements and should not automatically be interpreted as the intrinsic melting temperature of a purified protein.

All results above are from validation. The locked test set remains unopened.