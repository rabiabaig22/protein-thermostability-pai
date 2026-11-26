# Protein Thermostability Prediction

**Probability for AI, Fall 2026**

This project investigates how well Bayesian linear regression can predict protein melting temperatures (\(T_m\)) from amino acid composition and sequence length, and whether its predictive uncertainty is reliable, especially for proteins that differ from the training data. An ordinary least squares (OLS) model will provide a comparison.

## Data

The project uses the [TmProt dataset](https://zenodo.org/records/24504578). The available training and validation datasets are being inspected and prepared. The test set will remain untouched until the final evaluation; no test-set results are reported at this stage.

## Planned approach

- Represent each protein by its amino acid composition and log-transformed sequence length.
- Fit Bayesian linear regression with Gaussian priors on the regression coefficients.
- Fit an OLS baseline using the same features and data split.
- Evaluate predictive performance and predictive uncertainty, including calibration and sensitivity analysis.
- Examine reliability for proteins that differ from those represented in the training data.
- Reserve the test set for final evaluation after model decisions are complete.

## Current status

Work in progress. Current work includes dataset inspection, feature-engineering decisions, model specification, and initial website development. Full model evaluation, uncertainty and calibration analysis, sensitivity analysis, and final test-set evaluation are still pending. No final results are reported.

## Technology

- Python, NumPy, pandas, and SciPy
- React, TypeScript, and Recharts
