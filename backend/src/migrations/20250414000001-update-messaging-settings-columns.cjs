"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        -- Rename 'provider' to 'sms_provider' if old column exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='provider')
           AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='sms_provider')
        THEN
          ALTER TABLE crm_messaging_settings RENAME COLUMN provider TO sms_provider;
        END IF;

        -- Rename 'account_sid' to 'api_key' if old column exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='account_sid')
           AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='api_key')
        THEN
          ALTER TABLE crm_messaging_settings RENAME COLUMN account_sid TO api_key;
        END IF;

        -- Rename 'auth_token' to 'api_secret' if old column exists
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='auth_token')
           AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='api_secret')
        THEN
          ALTER TABLE crm_messaging_settings RENAME COLUMN auth_token TO api_secret;
        END IF;

        -- Add 'sender_id' if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='sender_id')
        THEN
          ALTER TABLE crm_messaging_settings ADD COLUMN sender_id VARCHAR(100);
        END IF;

        -- Add 'base_url' if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='base_url')
        THEN
          ALTER TABLE crm_messaging_settings ADD COLUMN base_url TEXT;
        END IF;

        -- Add 'extra_config' if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='extra_config')
        THEN
          ALTER TABLE crm_messaging_settings ADD COLUMN extra_config JSONB;
        END IF;

        -- Rename 'twilio_phone_number' to keep it but also ensure sms_provider default
        -- twilio_whatsapp_number should already exist from original migration

        -- Add sms_enabled and whatsapp_enabled if missing (they should exist but just in case)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='sms_enabled')
        THEN
          ALTER TABLE crm_messaging_settings ADD COLUMN sms_enabled BOOLEAN NOT NULL DEFAULT false;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='whatsapp_enabled')
        THEN
          ALTER TABLE crm_messaging_settings ADD COLUMN whatsapp_enabled BOOLEAN NOT NULL DEFAULT false;
        END IF;
      END $$;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='sms_provider')
        THEN
          ALTER TABLE crm_messaging_settings RENAME COLUMN sms_provider TO provider;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='api_key')
        THEN
          ALTER TABLE crm_messaging_settings RENAME COLUMN api_key TO account_sid;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='crm_messaging_settings' AND column_name='api_secret')
        THEN
          ALTER TABLE crm_messaging_settings RENAME COLUMN api_secret TO auth_token;
        END IF;
        ALTER TABLE crm_messaging_settings DROP COLUMN IF EXISTS sender_id;
        ALTER TABLE crm_messaging_settings DROP COLUMN IF EXISTS base_url;
        ALTER TABLE crm_messaging_settings DROP COLUMN IF EXISTS extra_config;
      END $$;
    `);
  },
};
