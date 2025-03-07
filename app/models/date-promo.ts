interface PromoContent {
    text: string;
    secondaryText: string;
    url: string;
    logoText: string;
    lightLogoUrl: string;
    darkLogoUrl: string;
}

interface PromoLocalization {
    default: PromoContent;
    country: string;
}

export interface DatePromo {
    default: PromoContent;
    country: string;
} 