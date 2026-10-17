/** Keep compact numeric answers together without squeezing long text into narrow columns. */
export const compactAnswers=(options:string[])=>options.length>=2&&options.every(option=>option.trim().length<=16&&!option.includes('\n'));
