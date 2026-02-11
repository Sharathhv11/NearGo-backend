const calculateProfileCompletion = (business) => {
  let percent = 20;

  if (business.categories?.length) percent += 15;
  if (business.workingHours?.weekdays?.open) percent += 10;
  if (business.media?.length >= 3) percent += 15;
  if (business.socialLinks?.website) percent += 5;
  if (business.socialLinks?.instagram) percent += 5;
  if (business.verification?.isVerified) percent += 15;

  return Math.min(percent, 100);
};


export default calculateProfileCompletion;