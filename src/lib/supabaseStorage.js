import supabase from './supabase';

export class SupabasePersonaStorage {
  constructor() {
    this.tableName = 'personas_pg2024';
    this.cacheTableName = 'demographic_cache_pg2024';
    this.preferencesTableName = 'user_preferences_pg2024';
    this.isAvailable = !!supabase;
  }

  // Check if Supabase is available
  checkAvailability() {
    return this.isAvailable && supabase;
  }

  // Authentication helpers
  async getCurrentUser() {
    if (!this.checkAvailability()) return null;
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.warn('Failed to get current user:', error);
      return null;
    }
  }

  async signUp(email, password) {
    if (!this.checkAvailability()) {
      throw new Error('Supabase not available');
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    
    if (error) throw error;
    return data;
  }

  async signIn(email, password) {
    if (!this.checkAvailability()) {
      throw new Error('Supabase not available');
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }

  async signOut() {
    if (!this.checkAvailability()) {
      throw new Error('Supabase not available');
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Persona CRUD operations
  async savePersonas(personas) {
    if (!this.checkAvailability()) {
      throw new Error('Supabase not available');
    }
    
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Prepare personas for database
      const personasForDB = personas.map(persona => ({
        ...persona,
        user_id: user.id,
        // Convert camelCase to snake_case for database
        first_name: persona.firstName,
        last_name: persona.lastName,
        age_group: persona.ageGroup,
        age_group_label: persona.ageGroupLabel,
        is_urban: persona.isUrban,
        job_title: persona.jobTitle,
        annual_income: persona.annualIncome,
        income_quintile: persona.incomeQuintile,
        income_quintile_label: persona.incomeQuintileLabel,
        household_type: persona.householdType,
        household_type_label: persona.householdTypeLabel,
        household_size: persona.householdSize,
        housing_type: persona.housingType,
        housing_type_label: persona.housingTypeLabel,
        owned_goods: persona.ownedGoods,
        spending_habits: persona.spendingHabits,
        pain_points: persona.painPoints,
        data_source: persona.dataSource || 'simulated'
      }));

      const { data, error } = await supabase
        .from(this.tableName)
        .upsert(personasForDB, { onConflict: 'id' })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving personas to Supabase:', error);
      throw error;
    }
  }

  async savePersona(persona) {
    return this.savePersonas([persona]);
  }

  async loadPersonas() {
    if (!this.checkAvailability()) {
      return [];
    }
    
    try {
      const user = await this.getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert snake_case back to camelCase
      return data.map(persona => ({
        ...persona,
        firstName: persona.first_name,
        lastName: persona.last_name,
        ageGroup: persona.age_group,
        ageGroupLabel: persona.age_group_label,
        isUrban: persona.is_urban,
        jobTitle: persona.job_title,
        annualIncome: persona.annual_income,
        incomeQuintile: persona.income_quintile,
        incomeQuintileLabel: persona.income_quintile_label,
        householdType: persona.household_type,
        householdTypeLabel: persona.household_type_label,
        householdSize: persona.household_size,
        housingType: persona.housing_type,
        housingTypeLabel: persona.housing_type_label,
        ownedGoods: persona.owned_goods,
        spendingHabits: persona.spending_habits,
        painPoints: persona.pain_points,
        dataSource: persona.data_source,
        createdAt: persona.created_at
      }));
    } catch (error) {
      console.error('Error loading personas from Supabase:', error);
      return [];
    }
  }

  async deletePersona(personaId) {
    if (!this.checkAvailability()) {
      throw new Error('Supabase not available');
    }
    
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', personaId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting persona:', error);
      throw error;
    }
  }

  async updatePersona(updatedPersona) {
    if (!this.checkAvailability()) {
      throw new Error('Supabase not available');
    }
    
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const personaForDB = {
        ...updatedPersona,
        user_id: user.id,
        first_name: updatedPersona.firstName,
        last_name: updatedPersona.lastName,
        age_group: updatedPersona.ageGroup,
        age_group_label: updatedPersona.ageGroupLabel,
        is_urban: updatedPersona.isUrban,
        job_title: updatedPersona.jobTitle,
        annual_income: updatedPersona.annualIncome,
        income_quintile: updatedPersona.incomeQuintile,
        income_quintile_label: updatedPersona.incomeQuintileLabel,
        household_type: updatedPersona.householdType,
        household_type_label: updatedPersona.householdTypeLabel,
        household_size: updatedPersona.householdSize,
        housing_type: updatedPersona.housingType,
        housing_type_label: updatedPersona.housingTypeLabel,
        owned_goods: updatedPersona.ownedGoods,
        spending_habits: updatedPersona.spendingHabits,
        pain_points: updatedPersona.painPoints,
        data_source: updatedPersona.dataSource || 'simulated'
      };

      const { data, error } = await supabase
        .from(this.tableName)
        .update(personaForDB)
        .eq('id', updatedPersona.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating persona:', error);
      throw error;
    }
  }

  async clearAllPersonas() {
    if (!this.checkAvailability()) {
      throw new Error('Supabase not available');
    }
    
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing personas:', error);
      throw error;
    }
  }

  // Cache operations for demographic data
  async saveCache(cacheKey, data, expirationHours = 24) {
    if (!this.checkAvailability()) {
      return false;
    }
    
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expirationHours);

      const { error } = await supabase
        .from(this.cacheTableName)
        .upsert({
          cache_key: cacheKey,
          data: data,
          expires_at: expiresAt.toISOString()
        }, { onConflict: 'cache_key' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving cache:', error);
      return false;
    }
  }

  async loadCache(cacheKey) {
    if (!this.checkAvailability()) {
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from(this.cacheTableName)
        .select('*')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No data found
        throw error;
      }

      return data.data;
    } catch (error) {
      console.error('Error loading cache:', error);
      return null;
    }
  }

  async clearCache(cacheKey = null) {
    if (!this.checkAvailability()) {
      return false;
    }
    
    try {
      let query = supabase.from(this.cacheTableName).delete();
      
      if (cacheKey) {
        query = query.eq('cache_key', cacheKey);
      } else {
        // Clear all expired cache
        query = query.lt('expires_at', new Date().toISOString());
      }

      const { error } = await query;
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  // User preferences
  async saveUserPreferences(preferences) {
    if (!this.checkAvailability()) {
      throw new Error('Supabase not available');
    }
    
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from(this.preferencesTableName)
        .upsert({
          user_id: user.id,
          preferences: preferences
        }, { onConflict: 'user_id' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }

  async loadUserPreferences() {
    if (!this.checkAvailability()) {
      return {};
    }
    
    try {
      const user = await this.getCurrentUser();
      if (!user) return {};

      const { data, error } = await supabase
        .from(this.preferencesTableName)
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return {}; // No preferences found
        throw error;
      }

      return data.preferences || {};
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return {};
    }
  }

  // Export/Import functionality
  async exportPersonas() {
    try {
      const personas = await this.loadPersonas();
      const dataStr = JSON.stringify(personas, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `personas-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting personas:', error);
      throw error;
    }
  }

  async importPersonas(file) {
    try {
      const text = await file.text();
      const personas = JSON.parse(text);
      
      if (!Array.isArray(personas)) {
        throw new Error('Ungültiges Datenformat');
      }

      // Remove IDs to create new personas
      const personasToImport = personas.map(persona => {
        const { id, user_id, created_at, updated_at, ...personaData } = persona;
        return {
          ...personaData,
          id: crypto.randomUUID() // Generate new ID
        };
      });

      await this.savePersonas(personasToImport);
      return personasToImport;
    } catch (error) {
      console.error('Error importing personas:', error);
      throw error;
    }
  }

  // Statistics and analytics
  async getPersonaStatistics() {
    if (!this.checkAvailability()) {
      return null;
    }
    
    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from(this.tableName)
        .select('age_group, income_quintile, household_type, gender, data_source')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate statistics
      const stats = {
        total: data.length,
        byAgeGroup: {},
        byIncome: {},
        byHousehold: {},
        byGender: {},
        byDataSource: {}
      };

      data.forEach(persona => {
        stats.byAgeGroup[persona.age_group] = (stats.byAgeGroup[persona.age_group] || 0) + 1;
        stats.byIncome[persona.income_quintile] = (stats.byIncome[persona.income_quintile] || 0) + 1;
        stats.byHousehold[persona.household_type] = (stats.byHousehold[persona.household_type] || 0) + 1;
        stats.byGender[persona.gender] = (stats.byGender[persona.gender] || 0) + 1;
        stats.byDataSource[persona.data_source] = (stats.byDataSource[persona.data_source] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting persona statistics:', error);
      return null;
    }
  }

  // Real-time subscriptions
  subscribeToPersonas(callback) {
    if (!this.checkAvailability()) {
      return null;
    }
    
    return supabase
      .channel('personas')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: this.tableName
      }, callback)
      .subscribe();
  }

  unsubscribe(subscription) {
    if (subscription && this.checkAvailability()) {
      supabase.removeChannel(subscription);
    }
  }
}

export default new SupabasePersonaStorage();