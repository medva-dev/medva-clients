import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://x.supabase.co';
const supabaseAnonKey = 'test';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const authHeaders = async () => {
//   const { data, error } = await supabase.auth.getSession();

//   if (error) {
//     throw new Error(error.message);
//   }

//   const { session } = data;

//   return {
//     authorization: `Bearer ${session?.access_token}`,
//   };
// };

const login = async (data) => {
  let response;
  if (data) {
    const { error, data: authResponse } =
      await supabase.auth.signInWithPassword(data);
    if (error) {
      throw new Error(error.message);
    }

    response = authResponse;
  } else {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 60000); // to have a delay and not repeat checking of user
    });
  }

  return { successMessage: 'Login successful, please wait', response };
};

const logout = async () => {
  await supabase.auth.signOut();
};

const getVirtualAssisitants = async (values = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { category, subCategories, page: nextPage } = values;

  const select =
    'id, firstName, lastName, registeredNurse, medicalDegree, hasExperience, category, subCategory, country, avatar, video, status,rating, professions(profession), experiences(experience)';

  const page = Number(nextPage ?? 1) || 1;
  const pageSize = 12;

  const rangeFrom = (page - 1) * pageSize;
  const rangeTo = rangeFrom + pageSize - 1;

  const prepare = supabase.from('virtualAssistants').select(select, {
    count: 'exact',
  });

  if (category) {
    prepare.match({
      category: String(category).toUpperCase(),
    });
  }

  const filter = [];
  Object.keys(subCategories || {}).forEach((sub) => {
    if (subCategories[sub] === true) {
      filter.push(String(sub).toUpperCase());
    }
  });

  if (filter.length > 0) {
    prepare.filter('subCategory', 'in', `(${filter.join(',')})`);
  }

  prepare.range(rangeFrom, rangeTo);

  const result = await prepare;

  const { data, error, count } = result;

  if (error) {
    throw error;
  }

  let totalPages = count / pageSize;
  if (totalPages % 1 === 0) {
    totalPages = Math.floor(totalPages);
  } else {
    totalPages = Math.floor(totalPages) + 1;
  }

  return {
    list: data,
    count,
    pageSize,
    currentPage: page,
    totalPages,
  };
};

const getClientId = () => {
  let clientId;
  try {
    const session = JSON.parse(localStorage.getItem('session'));
    clientId = session?.user?.id ?? undefined;
  } catch (e) {
    clientId = undefined;
  }
  return clientId;
};

const getClient = async (id) => {
  const { data, error } = await supabase.from('clients').select().eq('id', id);

  if (error) {
    throw error;
  }

  return data?.[0];
};

const createClientUser = async (insert) => {
  const referredBy = localStorage.getItem('ref') || undefined;
  if (referredBy) {
    insert.referredBy = referredBy;
  }

  const { error } = await supabase.from('clients').insert(insert);

  if (error) {
    throw error;
  }
};

const newBooking = async (insert) => {
  const { id: virtualAssistantId, date, time } = insert ?? {};

  if (!virtualAssistantId) {
    throw new Error('No virtual assistant selected');
  }

  if (!date) {
    throw new Error('Please select your preferred date');
  }

  if (!time) {
    throw new Error('Please select your preferred time');
  }

  const clientId = getClientId();

  const ins = {
    virtualAssistantId,
    date,
    time,
    clientId,
  };

  const { data, error } = await supabase.from('bookings').insert(ins);

  if (error) {
    throw error;
  }

  console.log({ data });

  return { successMessage: 'Successfully booked an appointment' };
};

const getAppointments = async () => {
  const clientId = getClientId();
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `*, virtualAssistants(firstName, lastName, avatar, category, subCategory)`
    )
    .eq('clientId', clientId);

  if (error) {
    throw error;
  }

  return data;
};

export const getInvoices = async () => {
  const clientId = getClientId();
  const { data, error } = await supabase
    .from('invoices')
    .select(`*, tdProjects!inner(name,clients!inner(id))`)
    .eq('tdProjects.clients.id', clientId);

  if (error) {
    throw error;
  }

  return data;
};

export default supabase;

export {
  login,
  logout,
  getVirtualAssisitants,
  getClient,
  createClientUser,
  newBooking,
  getAppointments,
  getClientId,
};
