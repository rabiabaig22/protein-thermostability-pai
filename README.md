# protein-thermostability-pai
Bayesian linear regression for protein thermostability prediction using amino acid composition and sequence length, with a focus on predictive uncertainty and model calibration.


# Protein Thermostability Prediction Using Bayesian Linear Regression

A probabilistic machine learning project investigating whether protein melting temperatures (\(T_m\)) can be predicted from amino acid composition and sequence length, and whether Bayesian uncertainty estimates can identify less reliable predictions.

## Research Question

How well can Bayesian linear regression predict protein melting temperatures from sequence composition and length, and how reliable are its uncertainty estimates, especially for proteins that differ from the training distribution?

## Project Overview

This project uses protein sequence-derived features to predict melting temperature in degrees Celsius.

The model uses:
- Proportions of 19 standard amino acids, with leucine excluded as the reference category.
- Log-transformed protein sequence length.
- Bayesian linear regression estimated using Gibbs sampling.
- Ordinary least squares (OLS) as a comparison baseline.

The Bayesian model provides posterior distributions for its coefficients and predictive uncertainty estimates.

## Dataset

The project uses the [Meltome Atlas dataset](https://zenodo.org/records/24504578).

The data is divided into training, validation, and locked test sets. The locked test set is reserved for final evaluation.

The target variable is protein melting temperature (\(T_m\), °C).

**Important:** Meltome Atlas temperatures are derived from thermal profiling measurements. They should not automatically be interpreted as intrinsic melting temperatures of purified proteins.

## Preliminary Results

On the validation set:

| Metric | Bayesian Regression | OLS |
|---|---:|---:|
| MAE (°C) | 6.1075 | 6.1078 |
| RMSE (°C) | 8.3363 | 8.3365 |
| R² | 0.1263 | 0.1262 |

The two models produce nearly identical point predictions.

The Bayesian model's average 90% predictive interval coverage is approximately 90.20%. However, coverage varies across feature-space distance groups. The farthest quartile has approximately 83.65% coverage, compared with 96.63% in the closest quartile.

These results suggest that Bayesian uncertainty estimates provide additional information, but do not automatically guarantee reliable uncertainty across different regions of the feature space.

## Website

The interactive React application presents:
- Model performance and dataset information.
- Predictive interval calibration.
- Prediction performance across feature-space distance groups.
- Posterior coefficient estimates and uncertainty intervals.

## Technologies

- Python
- NumPy
- Pandas
- SciPy
- Scikit-learn
- React
- TypeScript
- Recharts

## Project Status

The validation analysis and interactive application are in progress. Final conclusions will be updated after the locked test set is evaluated.

## Sources

- [Meltome Atlas dataset, Zenodo](https://zenodo.org/records/24504578)
- [Meltome Atlas publication](https://doi.org/10.1038/s41592-023-01939-5)

## Acknowledgement

Developed as an optional final project for Stanford's Probability for AI course, Fall 2026.

## Live Website

http://localhost:5174/
