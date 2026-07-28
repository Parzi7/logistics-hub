import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import CargoTable from './components/CargoTable';
import TransportTable from './components/TransportTable';
import ItemDetailsModal from './components/ItemDetailsModal';
import AddItemModal from './components/AddItemModal';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SubTabNavigation from './components/SubTabNavigation';
import AIBotButton from './components/AIBotButton';

// Імпортуємо парсер для точного розбору міст та країн
import { extractCountryCity } from './components/addItemHelpers';

export default function App() {
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [activeTab, setActiveTab] = useState('cargo'); 
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Стан для відкриття мобільного бокового меню
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [cargos, setCargos] = useState([]);
  const [transports, setTransports] = useState([]);
  const [archivedCargos, setArchivedCargos] = useState([]);
  const [archivedTransports, setArchivedTransports] = useState([]);

  // --- ХЕЛПЕРИ ДЛЯ КОНВЕРТАЦІЇ ДАНИХ (БД <-> ФРОНТЕНД) ---
  const formatFromDB = (row) => {
    const extraInfo = row.additional || row.notes || row.description || row.details || row.comment || '';

    // Заранее розбираємо країни та міста для 100% точності
    const fromParsed = extractCountryCity({ from_location: row.from_location }, true);
    const toParsed = extractCountryCity({ to_location: row.to_location }, false);

    const rawFrom = row.from_location || '';
    const rawTo = row.to_location || '';

    return {
      id: row.id,
      type: row.type,
      
      // Сирі значення без примусового тире '—' (щоб не псувати редагування)
      from_location: rawFrom,
      to_location: rawTo,
      
      // Явні поля міст та країн
      country_from: fromParsed.country,
      city_from: fromParsed.city,
      country_to: toParsed.country,
      city_to: toParsed.city,

      route: { from: rawFrom, to: rawTo },
      location: { from: rawFrom, to: rawTo },
      
      cargo: row.cargo || '',
      vehicle: row.vehicle || '',
      weight: row.weight || '',
      volume: row.volume || '',
      dates: row.dates || '',
      date: row.dates || '',
      price: row.price || '',
      company: row.company || '',
      contact: row.contact || '',
      phone: row.phone || '',

      // Дублюємо примітки в усі популярні ключі
      additional: extraInfo,
      notes: extraInfo,
      description: extraInfo,
      details: extraInfo,

      is_archived: row.is_archived || false,
      created_at: row.created_at,
      timeAdded: row.created_at 
        ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        : ''
    };
  };

  const formatToDB = (item, type, isArchived = false) => {
    const extraInfo = item.additional || item.notes || item.description || item.details || item.comment || '';

    // Отримуємо скомпільований рядок локації з модалки
    const fromLoc = item.from_location || item.route?.from || item.location?.from || '';
    const toLoc = item.to_location || item.route?.to || item.location?.to || '';

    return {
      type: type || item.type || 'cargo',
      from_location: fromLoc,
      to_location: toLoc,
      cargo: item.cargo || '',
      vehicle: item.vehicle || '',
      weight: item.weight || '',
      volume: item.volume || '',
      dates: item.dates || item.date || '',
      price: item.price || '',
      company: item.company || '',
      contact: item.contact || '',
      phone: item.phone || '',
      
      additional: extraInfo,
      is_archived: isArchived
    };
  };

  // --- 1. ЗАВАНТАЖЕННЯ ДАНИХ З SUPABASE ПРИ СТАРТІ ---
  const fetchAllData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('logistics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Помилка завантаження даних з Supabase:', error);
    } else if (data) {
      const formatted = data.map(formatFromDB);

      setCargos(formatted.filter(i => i.type === 'cargo' && !i.is_archived));
      setTransports(formatted.filter(i => i.type === 'transport' && !i.is_archived));
      setArchivedCargos(formatted.filter(i => i.type === 'cargo' && i.is_archived));
      setArchivedTransports(formatted.filter(i => i.type === 'transport' && i.is_archived));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Фільтрація пошуку
  const filterList = (list) => {
    if (!globalSearch.trim()) return list;
    const q = globalSearch.toLowerCase();
    return list.filter(item => {
      const from = (item.route?.from || item.location?.from || '').toLowerCase();
      const to = (item.route?.to || item.location?.to || '').toLowerCase();
      const title = (item.cargo || item.vehicle || '').toLowerCase();
      const price = (item.price || '').toLowerCase();
      const extra = (item.additional || item.notes || '').toLowerCase();
      return from.includes(q) || to.includes(q) || title.includes(q) || price.includes(q) || extra.includes(q);
    });
  };

  const handleOpenDetails = (item, type) => {
    setSelectedDetails({ item, type });
  };

  const handleCloseDetails = () => {
    setSelectedDetails(null);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item, type, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setEditingItem({ item, type });
    setIsAddModalOpen(true);
  };

  // --- 2. ЗБЕРЕЖЕННЯ ТА РЕДАГУВАННЯ ЗАПИСУ У БД ---
  const handleSaveItem = async (newItemData) => {
    const isEditing = Boolean(editingItem);
    const targetType = isEditing ? editingItem.type : activeTab;
    const dbPayload = formatToDB(newItemData, targetType, isArchiveView);

    if (isEditing) {
      const { error } = await supabase
        .from('logistics')
        .update(dbPayload)
        .eq('id', newItemData.id);

      if (error) {
        console.error('Помилка оновлення у БД:', error);
        alert('Помилка при збереженні змін');
        return;
      }
    } else {
      const { data, error } = await supabase
        .from('logistics')
        .insert([dbPayload])
        .select();

      if (error) {
        console.error('Помилка додавання у БД:', error);
        alert('Помилка при додаванні запису');
        return;
      }

      if (data && data[0]) {
        newItemData = formatFromDB(data[0]);
      }
    }

    await fetchAllData();
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  // --- 3. АРХІВУВАННЯ / РОЗАРХІВУВАННЯ У БД ---
  const handleArchive = async (id, type, e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    const newArchivedStatus = !isArchiveView;

    const { error } = await supabase
      .from('logistics')
      .update({ is_archived: newArchivedStatus })
      .eq('id', id);

    if (error) {
      console.error('Помилка зміни статусу архіву:', error);
      alert('Не вдалося змінити статус архіву');
      return;
    }

    await fetchAllData();
  };

  // --- 4. ВИДАЛЕННЯ З БД ---
  const handleDelete = async (id, type, e) => {
    if (e && e.stopPropagation) e.stopPropagation();

    if (!window.confirm('Ви впевнені, що хочете видалити цей запис?')) return;

    const { error } = await supabase
      .from('logistics')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Помилка видалення з БД:', error);
      alert('Не вдалося видалити запис');
      return;
    }

    await fetchAllData();
  };

  // --- 5. ОБРОБНИК ДЛЯ ШІ БОТА З ПРЯМИМ ЗБЕРЕЖЕННЯМ В SUPABASE ---
  const handleAddParsedData = async (parsedData) => {
    setIsArchiveView(false);

    const dbPayload = formatToDB(parsedData, parsedData.type, false);

    const { data, error } = await supabase
      .from('logistics')
      .insert([dbPayload])
      .select();

    if (error) {
      console.error('Помилка збереження заявки від ШІ в БД:', error);
      alert('Не вдалося зберегти заявку в базі');
      return;
    }

    if (data && data[0]) {
      const savedItem = formatFromDB(data[0]);

      if (savedItem.type === 'cargo') {
        setCargos(prev => [savedItem, ...prev]);
        setActiveTab('cargo');
      } else {
        setTransports(prev => [savedItem, ...prev]);
        setActiveTab('transport');
      }
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row min-h-screen bg-slate-100 font-sans text-slate-800">
      
      {/* Бокове меню */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isArchiveView={isArchiveView}
        setIsArchiveView={setIsArchiveView}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Основний контейнер контенту */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Шапка */}
        <Header 
          globalSearch={globalSearch} 
          setGlobalSearch={setGlobalSearch} 
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Контент сторінки */}
        <main className="flex-1 p-3 sm:p-6 md:p-8">
          <SubTabNavigation 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-slate-500 font-medium">Синхронізація з Supabase...</span>
            </div>
          ) : activeTab === 'cargo' ? (
            <CargoTable 
              cargos={filterList(isArchiveView ? archivedCargos : cargos)} 
              openDetails={handleOpenDetails}
              handleArchive={handleArchive}
              handleDelete={handleDelete}
              onEdit={handleOpenEditModal}
              onAdd={handleOpenAddModal}
              isArchiveView={isArchiveView}
            />
          ) : (
            <TransportTable 
              transports={filterList(isArchiveView ? archivedTransports : transports)} 
              openDetails={handleOpenDetails}
              handleArchive={handleArchive}
              handleDelete={handleDelete}
              onEdit={handleOpenEditModal}
              onAdd={handleOpenAddModal}
              isArchiveView={isArchiveView}
            />
          )}
        </main>
      </div>

      {selectedDetails && (
        <ItemDetailsModal 
          item={selectedDetails.item} 
          type={selectedDetails.type} 
          onClose={handleCloseDetails} 
        />
      )}

      {isAddModalOpen && (
        <AddItemModal 
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          initialData={editingItem?.item}
          type={editingItem ? editingItem.type : activeTab}
        />
      )}

      {/* ШІ Бот */}
      <AIBotButton onAddParsedData={handleAddParsedData} />

    </div>
  );
}