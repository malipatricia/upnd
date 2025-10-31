-- Custom SQL migration file, put your code below! --
CREATE TABLE "platform_settings" ( 
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "platform_name" text DEFAULT 'UPND Membership Platform' NOT NULL,
        "party_name" text DEFAULT 'United Party for National Development' NOT NULL,
        "party_motto" text DEFAULT 'Unity, Work, Progress' NOT NULL,
        "support_email" text DEFAULT 'membership@upnd.zm' NOT NULL,
        "support_phone" text DEFAULT '+260 211 123 456' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp
);