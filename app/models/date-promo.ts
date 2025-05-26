interface PromoContent {
    text: string;
    secondaryText: string;
    url: string;
    logoText: string;
    lightLogoUrl: string;
    darkLogoUrl: string;
}

export interface DatePromo {
    default: PromoContent;
    country: string;
}
