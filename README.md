# Ada's Machine Learning Tasting Lab

This project is a single-page walkthrough that follows Ada, an orchard scientist, as she learns three foundational machine learning techniques. Each lesson uses a tiny, fixed dataset so the calculations stay transparent, and every model renders a visual that mirrors how the algorithm reasons about the apples.

## Getting started

```bash
npm install
npm start
```

The development server opens the guided story in your browser. Build artifacts can be produced with `npm run build`.

## Algorithms and visuals

### 1. Linear Regression – drawing the tasting trend line

**What it does.** Linear regression fits a straight line through Ada's sweetness scores versus hours of practice. By minimizing the average error between the dots (observations) and the line, the model captures how much sweetness tends to improve per extra hour spent tasting.

**Visualization.** The scatter plot shows each tasting session as a blue dot and overlays the learned red trend line. Seeing the line bisect the cloud of dots highlights the "best fit" concept and makes the slope/intercept story concrete.

**Why it helps.** With the line in place, Ada can quickly estimate the sweetness score she should expect after any practice duration. The chart turns the abstract formula into an intuitive planning tool.

### 2. Logistic Regression – deciding which apples ship

**What it does.** Logistic regression predicts a probability between 0 and 1 that an apple is ready for the market based on two cues: crunchiness and color depth. Instead of fitting a line to numbers, the algorithm learns weights that steer an S-shaped curve (the logistic function) for yes/no outcomes.

**Visualization.** The canvas plots apples as colored dots (green for ready, red for not) and draws the bright blue decision boundary implied by the model. Everything on one side of the line is classified as "ship", the other as "hold".

**Why it helps.** Seeing the separation boundary makes it obvious how the two features combine to drive the decision. It reinforces that logistic regression still builds a linear separator, but interprets the result probabilistically.

### 3. Tiny Neural Network – spotting surprising combinations

**What it does.** The final lesson trains a two-layer neural network on an XOR-style dataset where apples are special if *either* flavor or texture is surprising, but not both. Hidden neurons learn intermediate detectors that the output neuron combines into the correct rule.

**Visualization.** The background heatmap shades the canvas from purple (ordinary) to orange (special) according to the network's confidence, while the dataset points remain on top. The curved, patchy regions reveal how combining multiple logistic units bends decision boundaries.

**Why it helps.** Neural networks feel abstract until you see how stacked activations carve out non-linear shapes. The heatmap shows the model's intuition across the whole feature space, letting learners grasp why hidden layers unlock more expressive decision surfaces.

