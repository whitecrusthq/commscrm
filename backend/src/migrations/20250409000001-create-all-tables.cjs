'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crm_agents', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'agent' },
      avatar: { type: Sequelize.STRING(500), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      allowed_menus: { type: Sequelize.JSON, allowNull: true, defaultValue: null },
      site_ids: { type: Sequelize.JSON, allowNull: true, defaultValue: null },
      totp_secret: { type: Sequelize.STRING(100), allowNull: true, defaultValue: null },
      totp_enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      active_conversations: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      resolved_today: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      rating: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 5.0 },
      last_active_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_customers', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: true },
      phone: { type: Sequelize.STRING(50), allowNull: true },
      channel: { type: Sequelize.STRING(50), allowNull: true },
      avatar: { type: Sequelize.STRING(500), allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      metadata: { type: Sequelize.JSON, allowNull: true },
      tags: { type: Sequelize.JSON, allowNull: true, defaultValue: [] },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      external_id: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_conversations', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      customer_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'crm_customers', key: 'id' } },
      assigned_agent_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'crm_agents', key: 'id' } },
      locked_by_agent_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'crm_agents', key: 'id' } },
      channel: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'web' },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'open' },
      priority: { type: Sequelize.STRING(10), allowNull: false, defaultValue: 'medium' },
      subject: { type: Sequelize.STRING(255), allowNull: true },
      tags: { type: Sequelize.JSON, allowNull: true, defaultValue: [] },
      last_message_at: { type: Sequelize.DATE, allowNull: true },
      follow_up_at: { type: Sequelize.DATE, allowNull: true, field: 'follow_up_at' },
      follow_up_note: { type: Sequelize.TEXT, allowNull: true, field: 'follow_up_note' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_messages', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      conversation_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'crm_conversations', key: 'id' } },
      sender_type: { type: Sequelize.STRING(20), allowNull: false },
      sender_id: { type: Sequelize.INTEGER, allowNull: true },
      content: { type: Sequelize.TEXT, allowNull: false },
      content_type: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'text' },
      metadata: { type: Sequelize.JSON, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_campaigns', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      channel: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'email' },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'draft' },
      subject: { type: Sequelize.STRING(255), allowNull: true },
      content: { type: Sequelize.TEXT, allowNull: true },
      scheduled_at: { type: Sequelize.DATE, allowNull: true },
      sent_at: { type: Sequelize.DATE, allowNull: true },
      recipients_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      open_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      click_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_by: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_channels', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      type: { type: Sequelize.STRING(50), allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      config: { type: Sequelize.JSON, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_closed_conversations', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      original_id: { type: Sequelize.INTEGER, allowNull: false },
      customer_id: { type: Sequelize.INTEGER, allowNull: false },
      customer_name: { type: Sequelize.STRING(100), allowNull: false },
      customer_email: { type: Sequelize.STRING(255), allowNull: true },
      assigned_agent_id: { type: Sequelize.INTEGER, allowNull: true },
      agent_name: { type: Sequelize.STRING(100), allowNull: true },
      channel: { type: Sequelize.STRING(50), allowNull: false },
      subject: { type: Sequelize.STRING(255), allowNull: true },
      tags: { type: Sequelize.JSON, allowNull: true },
      priority: { type: Sequelize.STRING(10), allowNull: true },
      message_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      resolution_note: { type: Sequelize.TEXT, allowNull: true },
      closed_at: { type: Sequelize.DATE, allowNull: false },
      opened_at: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_closed_messages', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      closed_conversation_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'crm_closed_conversations', key: 'id' } },
      sender_type: { type: Sequelize.STRING(20), allowNull: false },
      sender_id: { type: Sequelize.INTEGER, allowNull: true },
      sender_name: { type: Sequelize.STRING(100), allowNull: true },
      content: { type: Sequelize.TEXT, allowNull: false },
      content_type: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'text' },
      original_created_at: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_feedback', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      customer_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'crm_customers', key: 'id' } },
      agent_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'crm_agents', key: 'id' } },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true },
      category: { type: Sequelize.STRING(50), allowNull: true },
      source: { type: Sequelize.STRING(50), allowNull: true, defaultValue: 'manual' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_knowledge_docs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      category: { type: Sequelize.STRING(100), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_ai_settings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      provider: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'openai' },
      api_key: { type: Sequelize.STRING(500), allowNull: true },
      model: { type: Sequelize.STRING(100), allowNull: true },
      system_prompt: { type: Sequelize.TEXT, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_email_settings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      provider: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'mailgun' },
      api_key: { type: Sequelize.STRING(500), allowNull: true },
      domain: { type: Sequelize.STRING(255), allowNull: true },
      from_name: { type: Sequelize.STRING(100), allowNull: true },
      from_email: { type: Sequelize.STRING(255), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_agent_kpis', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      agent_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'crm_agents', key: 'id' } },
      period: { type: Sequelize.STRING(10), allowNull: false, defaultValue: 'weekly' },
      target_conversations: { type: Sequelize.INTEGER, allowNull: true },
      target_response_time_mins: { type: Sequelize.FLOAT, allowNull: true },
      target_resolution_rate: { type: Sequelize.FLOAT, allowNull: true },
      target_csat_score: { type: Sequelize.FLOAT, allowNull: true },
      target_reopen_rate: { type: Sequelize.FLOAT, allowNull: true },
      target_handle_time_mins: { type: Sequelize.FLOAT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_agent_attendance', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      agent_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'crm_agents', key: 'id' } },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      clock_in: { type: Sequelize.DATE, allowNull: true },
      clock_out: { type: Sequelize.DATE, allowNull: true },
      duration_minutes: { type: Sequelize.INTEGER, allowNull: true },
      clock_in_lat: { type: Sequelize.STRING(30), allowNull: true },
      clock_in_lng: { type: Sequelize.STRING(30), allowNull: true },
      clock_out_lat: { type: Sequelize.STRING(30), allowNull: true },
      clock_out_lng: { type: Sequelize.STRING(30), allowNull: true },
      face_image_in: { type: Sequelize.TEXT, allowNull: true },
      face_image_out: { type: Sequelize.TEXT, allowNull: true },
      clock_in_photo_time: { type: Sequelize.DATE, allowNull: true },
      clock_out_photo_time: { type: Sequelize.DATE, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      face_review_status: { type: Sequelize.STRING(10), allowNull: false, defaultValue: 'pending' },
      face_reviewed_by: { type: Sequelize.INTEGER, allowNull: true },
      face_reviewed_at: { type: Sequelize.DATE, allowNull: true },
      shift_start_expected: { type: Sequelize.STRING(5), allowNull: true },
      shift_grace_minutes: { type: Sequelize.INTEGER, allowNull: true },
      clock_in_diff_minutes: { type: Sequelize.INTEGER, allowNull: true },
      device_id: { type: Sequelize.STRING(64), allowNull: true },
      device_type: { type: Sequelize.STRING(20), allowNull: true },
      device_browser: { type: Sequelize.STRING(40), allowNull: true },
      device_os: { type: Sequelize.STRING(40), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_agent_attendance_pings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      attendance_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'crm_agent_attendance', key: 'id' } },
      agent_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'crm_agents', key: 'id' } },
      lat: { type: Sequelize.STRING(30), allowNull: false },
      lng: { type: Sequelize.STRING(30), allowNull: false },
      recorded_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_agent_shifts', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      agent_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'crm_agents', key: 'id' } },
      shift_name: { type: Sequelize.STRING(100), allowNull: false },
      start_time: { type: Sequelize.STRING(5), allowNull: false },
      end_time: { type: Sequelize.STRING(5), allowNull: false },
      days_of_week: { type: Sequelize.TEXT, allowNull: false, defaultValue: '[1,2,3,4,5]' },
      grace_minutes: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 15 },
      timezone: { type: Sequelize.STRING(60), allowNull: false, defaultValue: 'UTC' },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_branding_settings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      company_name: { type: Sequelize.STRING(200), allowNull: false, defaultValue: 'CommsCRM' },
      primary_color: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '#4F46E5' },
      sidebar_color: { type: Sequelize.STRING(20), allowNull: false, defaultValue: '#3F0E40' },
      logo_url: { type: Sequelize.STRING(500), allowNull: true },
      background_url: { type: Sequelize.STRING(500), allowNull: true },
      default_currency: { type: Sequelize.STRING(3), allowNull: false, defaultValue: 'USD' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_retention_settings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      auto_close_days: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 30 },
      archive_after_days: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 90 },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_follow_up_rules', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      trigger_type: { type: Sequelize.STRING(30), allowNull: false },
      delay_hours: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 24 },
      message_template: { type: Sequelize.TEXT, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_sites', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      address: { type: Sequelize.TEXT, allowNull: true },
      lat: { type: Sequelize.STRING(30), allowNull: true },
      lng: { type: Sequelize.STRING(30), allowNull: true },
      radius_meters: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 200 },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_payment_configs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      provider: { type: Sequelize.STRING(30), allowNull: false },
      display_name: { type: Sequelize.STRING(100), allowNull: true },
      api_key: { type: Sequelize.STRING(500), allowNull: true },
      secret_key: { type: Sequelize.STRING(500), allowNull: true },
      webhook_secret: { type: Sequelize.STRING(500), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_test_mode: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      metadata: { type: Sequelize.JSON, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_payment_transactions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      provider: { type: Sequelize.STRING(30), allowNull: false },
      tx_ref: { type: Sequelize.STRING(255), allowNull: false },
      amount: { type: Sequelize.FLOAT, allowNull: false },
      currency: { type: Sequelize.STRING(5), allowNull: false, defaultValue: 'USD' },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'pending' },
      customer_name: { type: Sequelize.STRING(200), allowNull: true },
      customer_email: { type: Sequelize.STRING(255), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      metadata: { type: Sequelize.JSON, allowNull: true },
      paid_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_payment_links', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      provider: { type: Sequelize.STRING(30), allowNull: false },
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      amount: { type: Sequelize.FLOAT, allowNull: false },
      currency: { type: Sequelize.STRING(5), allowNull: false, defaultValue: 'USD' },
      status: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'active' },
      link_token: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      link_url: { type: Sequelize.STRING(500), allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: true },
      paid_at: { type: Sequelize.DATE, allowNull: true },
      customer_name: { type: Sequelize.STRING(200), allowNull: true },
      customer_email: { type: Sequelize.STRING(255), allowNull: true },
      created_by: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_ai_exceptions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      type: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'exception' },
      phrase: { type: Sequelize.STRING(500), allowNull: true },
      reason: { type: Sequelize.TEXT, allowNull: true },
      content: { type: Sequelize.TEXT, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_product_categories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_product_sources', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      type: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'manual' },
      api_url: { type: Sequelize.STRING(500), allowNull: true },
      api_key: { type: Sequelize.STRING(500), allowNull: true },
      webhook_secret: { type: Sequelize.STRING(255), allowNull: true },
      field_mapping: { type: Sequelize.JSON, allowNull: true },
      sync_interval_minutes: { type: Sequelize.INTEGER, allowNull: true },
      last_sync_at: { type: Sequelize.DATE, allowNull: true },
      last_sync_status: { type: Sequelize.STRING(20), allowNull: true },
      last_sync_count: { type: Sequelize.INTEGER, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_products', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      external_id: { type: Sequelize.STRING(255), allowNull: true },
      name: { type: Sequelize.STRING(300), allowNull: false },
      sku: { type: Sequelize.STRING(100), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 },
      currency: { type: Sequelize.STRING(3), allowNull: false, defaultValue: 'USD' },
      category_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'crm_product_categories', key: 'id' } },
      image_url: { type: Sequelize.STRING(500), allowNull: true },
      stock_qty: { type: Sequelize.INTEGER, allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      metadata: { type: Sequelize.JSON, allowNull: true },
      source_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'crm_product_sources', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_customer_groups', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      color: { type: Sequelize.STRING(20), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.createTable('crm_customer_group_members', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      group_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'crm_customer_groups', key: 'id' } },
      customer_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'crm_customers', key: 'id' } },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface) {
    const tables = [
      'crm_customer_group_members',
      'crm_customer_groups',
      'crm_products',
      'crm_product_sources',
      'crm_product_categories',
      'crm_ai_exceptions',
      'crm_payment_links',
      'crm_payment_transactions',
      'crm_payment_configs',
      'crm_sites',
      'crm_follow_up_rules',
      'crm_retention_settings',
      'crm_branding_settings',
      'crm_agent_shifts',
      'crm_agent_attendance_pings',
      'crm_agent_attendance',
      'crm_agent_kpis',
      'crm_email_settings',
      'crm_ai_settings',
      'crm_knowledge_docs',
      'crm_feedback',
      'crm_closed_messages',
      'crm_closed_conversations',
      'crm_channels',
      'crm_campaigns',
      'crm_messages',
      'crm_conversations',
      'crm_customers',
      'crm_agents',
    ];
    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  },
};
