export function Brent(func, lowerLimit, upperLimit, maxIter, errorTol) {
  let a = lowerLimit;
  let b = upperLimit;
  let c = a;
  let fa = func(a);
  let fb = func(b);
  let fc = fa;
  let s = 0;
  let fs = 0;
  let tol_act; // Actual tolerance
  let new_step; // Step at this iteration
  let prev_step; // Distance from the last but one to the last approximation
  let p; // Interpolation step is calculated in the form p/q; division is delayed until the last moment
  let q;

  // define a result object
  let result = {
    Result: 10,
    Iterations: 0,
    Error: false,
  };

  let set_max_iterations = maxIter;

  errorTol = errorTol || 0;
  maxIter = maxIter || 1000;

  while (maxIter-- > 0) {
    prev_step = b - a;

    if (Math.abs(fc) < Math.abs(fb)) {
      // Swap data for b to be the best approximation
      (a = b), (b = c), (c = a);
      (fa = fb), (fb = fc), (fc = fa);
    }

    tol_act = 1e-15 * Math.abs(b) + errorTol / 2;
    new_step = (c - b) / 2;

    if (Math.abs(new_step) <= tol_act || fb === 0) {
      result.Result = b;
      result.Error = false;
      result.Iterations = set_max_iterations - maxIter;
      return result; // Acceptable approx. is found
    }
    // Decide if the interpolation can be tried
    if (Math.abs(prev_step) >= tol_act && Math.abs(fa) > Math.abs(fb)) {
      // If prev_step was large enough and was in true direction, Interpolatiom may be tried
      var t1, cb, t2;
      cb = c - b;
      if (a === c) {
        // If we have only two distinct points linear interpolation can only be applied
        t1 = fb / fa;
        p = cb * t1;
        q = 1.0 - t1;
      } else {
        // Quadric inverse interpolation
        (q = fa / fc), (t1 = fb / fc), (t2 = fb / fa);
        p = t2 * (cb * q * (q - t1) - (b - a) * (t1 - 1));
        q = (q - 1) * (t1 - 1) * (t2 - 1);
      }

      if (p > 0) {
        q = -q; // p was calculated with the opposite sign; make p positive
      } else {
        p = -p; // and assign possible minus to q
      }

      if (
        p < 0.75 * cb * q - Math.abs(tol_act * q) / 2 &&
        p < Math.abs((prev_step * q) / 2)
      ) {
        // If (b + p / q) falls in [b,c] and isn't too large it is accepted
        new_step = p / q;
      }

      // If p/q is too large then the bissection procedure can reduce [b,c] range to more extent
    }

    if (Math.abs(new_step) < tol_act) {
      // Adjust the step to be not less than tolerance
      new_step = new_step > 0 ? tol_act : -tol_act;
    }

    (a = b), (fa = fb); // Save the previous approx.
    (b += new_step), (fb = func(b)); // Do step to a new approxim.

    if ((fb > 0 && fc > 0) || (fb < 0 && fc < 0)) {
      (c = a), (fc = fa); // Adjust c for it to have a sign opposite to that of b
    }
  }

  // configure the return object if not within range
  result.Result = -1;
  result.Error = true;
  result.Iterations = set_max_iterations - maxIter;
  return result; // No acceptable approximation. is found
}
