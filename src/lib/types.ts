
export type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Data {
    name: string;
    level?: Level;
    children?: Data[];
}
