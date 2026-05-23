export interface Issue {
  id?: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
  reporter_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface QueryParams {
  sort?: string;
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}
