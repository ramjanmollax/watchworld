export const toBanglaDigits = (num: number | string): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/\d/g, (digit) => banglaDigits[parseInt(digit, 10)]);
};

export const formatPrice = (price: number): string => {
  const formattedNumber = new Intl.NumberFormat('en-IN').format(price);
  return `৳ ${toBanglaDigits(formattedNumber)}`;
};

export const formatBanglaDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = hours.toString().padStart(2, '0');
    
    return `${toBanglaDigits(day)} ${month} ${toBanglaDigits(year)}, ${toBanglaDigits(hoursStr)}:${toBanglaDigits(minutes)} ${ampm}`;
  } catch {
    return dateString;
  }
};
