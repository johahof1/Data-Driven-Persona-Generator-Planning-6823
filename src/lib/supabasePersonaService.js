import supabase from './supabase';

export class SupabasePersonaService {
  constructor() {
    this.tableName = 'personas_pg_2025';
    this.cacheTableName = 'persona_cache_pg_2025';
    this.isAvailable = false;
    this.checkConnection();
  }

  async checkConnection() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('count', { count: 'exact', head: true });
      
      if (!error) {
        this.isAvailable = true;
        console.log('✅ Supabase connection established');
      } else {
        console.warn('⚠️ Supabase not available, using localStorage fallback');
        this.isAvailable = false;
      }
    } catch (error) {
      console.warn('⚠️ Supabase connection failed, using localStorage fallback');
      this.isAvailable = false;
    }
  }

  // Personas speichern
  async savePersona(persona) {
    if (!this.isAvailable) {
      throw new Error('Supabase not available');
    }

    try {
      const personaData = this.formatPersonaForDatabase(persona);
      
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([personaData])
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ Persona saved to Supabase:', data.id);
      return this.formatPersonaFromDatabase(data);
    } catch (error) {
      console.error('❌ Error saving persona to Supabase:', error);
      throw error;
    }
  }

  // Mehrere Personas speichern
  async savePersonas(personas) {
    if (!this.isAvailable) {
      throw new Error('Supabase not available');
    }

    try {
      const personaData = personas.map(persona => this.formatPersonaForDatabase(persona));
      
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(personaData)
        .select();

      if (error) throw error;
      
      console.log(`✅ ${data.length} Personas saved to Supabase`);
      return data.map(item => this.formatPersonaFromDatabase(item));
    } catch (error) {
      console.error('❌ Error saving personas to Supabase:', error);
      throw error;
    }
  }

  // Alle Personas laden
  async loadPersonas(limit = 1000, offset = 0) {
    if (!this.isAvailable) {
      throw new Error('Supabase not available');
    }

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      console.log(`✅ Loaded ${data.length} personas from Supabase`);
      return data.map(item => this.formatPersonaFromDatabase(item));
    } catch (error) {
      console.error('❌ Error loading personas from Supabase:', error);
      throw error;
    }
  }

  // Persona nach ID laden
  async getPersonaById(id) {
    if (!this.isAvailable) {
      throw new Error('Supabase not available');
    }

    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return this.formatPersonaFromDatabase(data);
    } catch (error) {
      console.error('❌ Error loading persona from Supabase:', error);
      throw error;
    }
  }

  // Persona aktualisieren
  async updatePersona(persona) {
    if (!this.isAvailable) {
      throw new Error('Supabase not available');
    }

    try {
      const personaData = this.formatPersonaForDatabase(persona);
      delete personaData.id; // ID nicht überschreiben
      
      const { data, error } = await supabase
        .from(this.tableName)
        .update(personaData)
        .eq('id', persona.id)
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ Persona updated in Supabase:', data.id);
      return this.formatPersonaFromDatabase(data);
    } catch (error) {
      console.error('❌ Error updating persona in Supabase:', error);
      throw error;
    }
  }

  // Persona löschen
  async deletePersona(id) {
    if (!this.isAvailable) {
      throw new Error('Supabase not available');
    }

    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('✅ Persona deleted from Supabase:', id);
      return true;
    } catch (error) {
      console.error('❌ Error deleting persona from Supabase:', error);
      throw error;
    }
  }

  // Alle Personas löschen
  async clearAllPersonas() {
    if (!this.isAvailable) {
      throw new Error('Supabase not available');
    }

    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Lösche alle außer nicht-existierender ID

      if (error) throw error;
      
      console.log('✅ All personas cleared from Supabase');
      return true;
    } catch (error) {
      console.error('❌ Error clearing personas from Supabase:', error);
      throw error;
    }
  }

  // Personas mit Filtern suchen
  async searchPersonas(filters = {}) {
    if (!this.isAvailable) {
      throw new Error('Supabase not available');
    }

    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      // Filter anwenden
      if (filters.gender) {
        query = query.eq('gender', filters.gender);
      }
      if (filters.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      if (filters.incomeQuintile) {
        query = query.eq('income_quintile', filters.incomeQuintile);
      }
      if (filters.householdType) {
        query = query.eq('household_type', filters.householdType);
      }
      if (filters.housingType) {
        query = query.eq('housing_type', filters.housingType);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.minAge) {
        query = query.gte('age', filters.minAge);
      }
      if (filters.maxAge) {
        query = query.lte('age', filters.maxAge);
      }
      if (filters.minIncome) {
        query = query.gte('annual_income', filters.minIncome);
      }
      if (filters.maxIncome) {
        query = query.lte('annual_income', filters.maxIncome);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      console.log(`✅ Found ${data.length} personas matching filters`);
      return data.map(item => this.formatPersonaFromDatabase(item));
    } catch (error) {
      console.error('❌ Error searching personas in Supabase:', error);
      throw error;
    }
  }

  // Cache-Funktionen
  async saveCache(key, data, expirationHours = 24) {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expirationHours);

      const { error } = await supabase
        .from(this.cacheTableName)
        .upsert({
          cache_key: key,
          cache_data: data,
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;
      
      console.log('✅ Cache saved to Supabase:', key);
      return true;
    } catch (error) {
      console.error('❌ Error saving cache to Supabase:', error);
      return false;
    }
  }

  async loadCache(key) {
    if (!this.isAvailable) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from(this.cacheTableName)
        .select('*')
        .eq('cache_key', key)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        return null;
      }
      
      console.log('✅ Cache loaded from Supabase:', key);
      return data.cache_data;
    } catch (error) {
      console.error('❌ Error loading cache from Supabase:', error);
      return null;
    }
  }

  async clearExpiredCache() {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const { error } = await supabase
        .from(this.cacheTableName)
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) throw error;
      
      console.log('✅ Expired cache cleared from Supabase');
      return true;
    } catch (error) {
      console.error('❌ Error clearing expired cache from Supabase:', error);
      return false;
    }
  }

  // Statistiken
  async getPersonaStats() {
    if (!this.isAvailable) {
      throw new Error('Supabase not available');
    }

    try {
      // Gesamtanzahl
      const { count: totalCount } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Statistiken nach Geschlecht
      const { data: genderStats } = await supabase
        .from(this.tableName)
        .select('gender')
        .then(({ data }) => {
          const stats = {};
          data?.forEach(item => {
            stats[item.gender] = (stats[item.gender] || 0) + 1;
          });
          return { data: stats };
        });

      // Statistiken nach Altersgruppen
      const { data: ageStats } = await supabase
        .from(this.tableName)
        .select('age_group')
        .then(({ data }) => {
          const stats = {};
          data?.forEach(item => {
            stats[item.age_group] = (stats[item.age_group] || 0) + 1;
          });
          return { data: stats };
        });

      // Statistiken nach Einkommensgruppen
      const { data: incomeStats } = await supabase
        .from(this.tableName)
        .select('income_quintile')
        .then(({ data }) => {
          const stats = {};
          data?.forEach(item => {
            stats[item.income_quintile] = (stats[item.income_quintile] || 0) + 1;
          });
          return { data: stats };
        });

      return {
        total: totalCount || 0,
        byGender: genderStats || {},
        byAgeGroup: ageStats || {},
        byIncomeQuintile: incomeStats || {}
      };
    } catch (error) {
      console.error('❌ Error getting persona stats from Supabase:', error);
      throw error;
    }
  }

  // Hilfsfunktionen für Datenformatierung
  formatPersonaForDatabase(persona) {
    return {
      id: persona.id,
      first_name: persona.firstName,
      last_name: persona.lastName,
      age: persona.age,
      gender: persona.gender,
      avatar: persona.avatar,
      age_group: persona.ageGroup,
      age_group_label: persona.ageGroupLabel,
      location: persona.location,
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
      goals: persona.goals,
      pain_points: persona.painPoints,
      motivations: persona.motivations,
      data_source: persona.dataSource || 'simulated'
    };
  }

  formatPersonaFromDatabase(data) {
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      age: data.age,
      gender: data.gender,
      avatar: data.avatar,
      ageGroup: data.age_group,
      ageGroupLabel: data.age_group_label,
      location: data.location,
      isUrban: data.is_urban,
      jobTitle: data.job_title,
      annualIncome: data.annual_income,
      incomeQuintile: data.income_quintile,
      incomeQuintileLabel: data.income_quintile_label,
      householdType: data.household_type,
      householdTypeLabel: data.household_type_label,
      householdSize: data.household_size,
      housingType: data.housing_type,
      housingTypeLabel: data.housing_type_label,
      ownedGoods: data.owned_goods,
      spendingHabits: data.spending_habits,
      goals: data.goals,
      painPoints: data.pain_points,
      motivations: data.motivations,
      dataSource: data.data_source,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  // Realtime-Subscriptions
  subscribeToPersonaChanges(callback) {
    if (!this.isAvailable) {
      return null;
    }

    return supabase
      .channel('persona-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: this.tableName 
        }, 
        (payload) => {
          console.log('🔄 Realtime persona change:', payload);
          callback(payload);
        }
      )
      .subscribe();
  }

  unsubscribeFromChanges(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
}

export default new SupabasePersonaService();