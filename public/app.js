const STATE = {
  user: null,
  budget: null,
  route: 'landingPage',
  editing: false
};

const setState = (newState, state=STATE) => {
  return Object.assign(state, newState);
};

// landing page
// area for user to sign up/sign in
// dashboard holds budget
// user signs in, retrieves their budget
// user signs up, creates new budget, saves it to that user
// budget design - is it one form, several forms depending on area etc...