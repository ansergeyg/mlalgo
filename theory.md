# Theory Behind The Algorithms

This document summarizes the mathematical formulas used by the learning algorithms in `src/algorithms.js`. Each section gives the core equations, defines every variable, and explains why the formulation is used.

## Linear Regression (Ordinary Least Squares)

Model (one feature):

$$
\hat y = \alpha + \beta x
$$

Closed-form solution via Ordinary Least Squares (OLS):

$$
\beta = \frac{n\sum_{i=1}^n x_i y_i - \left(\sum_{i=1}^n x_i\right)\left(\sum_{i=1}^n y_i\right)}{n\sum_{i=1}^n x_i^2 - \left(\sum_{i=1}^n x_i\right)^2},
\qquad
\alpha = \frac{1}{n}\left(\sum_{i=1}^n y_i - \beta \sum_{i=1}^n x_i\right)
$$

Summary error (reported in the UI):

$$
\text{MAE} = \frac{1}{n}\sum_{i=1}^n \left|\, (\alpha + \beta x_i) - y_i\,\right|
$$

Variables:

- $x_i$: input feature for example $i$ ("hours").
- $y_i$: target value for example $i$ ("score").
- $n$: number of examples.
- $\beta$: slope (change in $\hat y$ per unit change in $x$).
- $\alpha$: intercept (value of $\hat y$ when $x=0$).
- $\hat y$: model prediction for $y$.
- MAE: mean absolute error used for an easily interpretable error summary.

Why this formulation:

- OLS yields a closed-form, statistically efficient estimate of $\alpha$ and $\beta$ under standard assumptions (independent errors with constant variance).
- Reporting MAE makes the typical magnitude of prediction error immediately understandable (in target units).

## Logistic Regression (Binary Classification)

Model probability with the logistic (sigmoid) link:

$$
\hat p = \sigma(\mathbf{w}^\top\mathbf{x} + b)
\quad\text{with}\quad
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

Decision rule and boundary (for two features):

$$
\hat y = \begin{cases}
1 & \text{if } \hat p \ge 0.5 \\
0 & \text{otherwise}
\end{cases}
\qquad\Longleftrightarrow\qquad
\mathbf{w}^\top\mathbf{x} + b = 0
$$

We optimize the cross-entropy loss using (mini)batch gradient descent. For labels $y\in\{0,1\}$ the gradients simplify to:

$$
\nabla_{\mathbf{w}}\,\mathcal{L} = \frac{1}{m}\sum_{i=1}^m (\hat p_i - y_i)\,\mathbf{x}_i,
\qquad
\nabla_b\,\mathcal{L} = \frac{1}{m}\sum_{i=1}^m (\hat p_i - y_i)
$$

SGD updates used in code:

$$
\mathbf{w} \leftarrow \mathbf{w} - \eta\, \nabla_{\mathbf{w}}\,\mathcal{L},
\qquad
b \leftarrow b - \eta\, \nabla_b\,\mathcal{L}
$$

Reported accuracy:

$$
\text{Acc} = \frac{1}{m}\sum_{i=1}^m \mathbf{1}\big[\, \hat p_i \ge 0.5 \iff y_i = 1 \,\big]
$$

Variables:

- $\mathbf{x}_i \in \mathbb{R}^d$: input feature vector for example $i$ (crunchiness, color depth).
- $y_i \in \{0,1\}$: binary label (ready or not).
- $\mathbf{w} \in \mathbb{R}^d$: weight vector.
- $b \in \mathbb{R}$: bias.
- $m$: number of examples in the batch (here, the whole dataset each epoch).
- $\eta$: learning rate.
- $\hat p_i$: predicted probability $\Pr(y_i=1\mid\mathbf{x}_i)$.

Why this formulation:

- The logistic link maps any real-valued score to a valid probability in $(0,1)$.
- Cross-entropy has a clean probabilistic interpretation and, with a sigmoid, yields simple gradients $(\hat p - y)$ used in the implementation.
- The linear boundary line ($\mathbf{w}^\top\mathbf{x} + b = 0$) matches the 2D visual decision boundary drawn in the app.

## Tiny Neural Network (2–2–1 with Sigmoids)

Architecture and forward pass for a 2-input, 2-hidden, 1-output network with sigmoid activations:

$$
\begin{aligned}
\mathbf{z}_1 &= W_1 \mathbf{x} + \mathbf{b}_1, & \quad \mathbf{a}_1 &= \sigma(\mathbf{z}_1) \\
z_2 &= \mathbf{w}_2^\top \mathbf{a}_1 + b_2, & \quad \hat y &= \sigma(z_2)
\end{aligned}
$$

Sigmoid and its derivative:

$$
\sigma(z) = \frac{1}{1 + e^{-z}},
\qquad
\sigma'(z) = \sigma(z)\bigl(1 - \sigma(z)\bigr)
$$

Using cross-entropy for a single-output sigmoid, the output-layer error term is:

$$
\delta_2 = \hat y - y
$$

Backpropagation (hidden layer has two units, elementwise operations understood):

$$
\begin{aligned}
\nabla_{\mathbf{w}_2}\,\mathcal{L} &= \delta_2\,\mathbf{a}_1, & \quad \nabla_{b_2}\,\mathcal{L} &= \delta_2 \\
\boldsymbol{\delta}_1 &= \big(\delta_2\,\mathbf{w}_2\big) \odot \sigma'(\mathbf{z}_1) \\
\nabla_{W_1}\,\mathcal{L} &= \boldsymbol{\delta}_1\,\mathbf{x}^\top, & \quad \nabla_{\mathbf{b}_1}\,\mathcal{L} &= \boldsymbol{\delta}_1
\end{aligned}
$$

Parameters are updated with batch-averaged gradients and learning rate $\eta$ as in logistic regression.

Variables:

- $\mathbf{x} \in \mathbb{R}^2$: input features (flavor surprise, texture surprise).
- $W_1 \in \mathbb{R}^{2\times 2}$, $\mathbf{b}_1 \in \mathbb{R}^2$: first layer weights and biases.
- $\mathbf{w}_2 \in \mathbb{R}^2$, $b_2 \in \mathbb{R}$: second layer weights and bias.
- $\mathbf{z}_1, \mathbf{a}_1$: pre-activation and activation of the hidden layer.
- $z_2, \hat y$: pre-activation and predicted probability at the output.
- $\delta_2, \boldsymbol{\delta}_1$: output and hidden layer error signals.

Why this formulation:

- A single hidden layer with nonlinear activation can model non-linearly separable patterns (e.g., XOR), which linear/logistic regression cannot.
- Sigmoid + cross-entropy yields simple, stable gradients; the code implements exactly these backprop equations.

