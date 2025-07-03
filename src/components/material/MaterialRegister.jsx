import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { getMaterials, getMaterialById, createMaterial, updateMaterial as updateMaterialApi } from "./api";
import ModalDialog from '../shared/modal/ModalDialog';

function MaterialRegister({ onRegister }) {
  const [form, setForm] = React.useState({
    name: '',
    description: '',
    unit: '',
    unit_price: '',
    stock_quantity: '',
    minimum_stock: '',
    category: ''
  });
  const navigate = useNavigate();

  const [materials, setMaterials] = React.useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showErrorDialog, setErrorShowDialog] = useState(false);
  const [showNewMaterial, setshowNewMaterial] = useState(false);  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);


  const formatCurrency = (value) => {
    if (!value) return '';
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    // Converte para número e divide por 100 para ter centavos
    const amount = parseInt(numbers) / 100;
    // Formata como moeda brasileira
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const parseCurrency = (value) => {
    if (!value) return '';
    // Remove R$, espaços, pontos e substitui vírgula por ponto
    return value.replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'unit_price') {
      // Para o campo de preço, aplica formatação de moeda
      const formattedValue = formatCurrency(value);
      setForm({ ...form, [name]: formattedValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => {
    getMaterials()
      .then(data => {
        if (Array.isArray(data)) {
          setMaterials(data);
        } else if (data.success) {
          setMaterials(data.data);
        } else {
          setMaterials([]);
        }
      })
      .catch(error => {
        setMaterials([]);
        setErrorMsg('Erro ao buscar os dados');
        setErrorShowDialog(true);
      });
  }, []);

  useEffect(() => {
    if (window.location.pathname.startsWith('/editar-material/')) {
      setIsEdit(true);
      const id = window.location.pathname.split('/').pop();
      setEditId(id);        
      getMaterialById(id)
        .then(data => {
          console.log('Dados recebidos para edição:', data);
          if (data.success && data.data) {
            setForm({
              name: data.data.name || '',
              description: data.data.description || '',
              unit: data.data.unit || '',
              unit_price: formatCurrency((data.data.unit_price * 100).toString()) || '',
              stock_quantity: data.data.stock_quantity || '',
              minimum_stock: data.data.minimum_stock || '',
              category: data.data.category || ''
            });
          }
        })
        .catch(error => {
          // Se der erro, mantém o formulário vazio
          console.error('Erro ao buscar material para edição:', error);
        });
    } else {
      setIsEdit(false);
      setEditId(null);
    }
  }, []);  const addMaterial = (e) => {
    e.preventDefault();
    // Converte o preço formatado para número antes de enviar
    const formData = {
      ...form,
      unit_price: parseCurrency(form.unit_price)
    };
    
    createMaterial(formData)
      .then(data => {
        if (data.success) {
          setSuccessMsg("Material cadastrado com sucesso!");
          setshowNewMaterial(true);
          setShowDialog(true);
          setForm({
            name: '',
            description: '',
            unit: '',
            unit_price: '',
            stock_quantity: '',
            minimum_stock: '',
            category: ''
          });
        } else {
          setErrorMsg(data.message || "Erro ao salvar material");
          setErrorShowDialog(true);
        }
      })
      .catch(error => {
        setErrorMsg("Erro ao salvar material");
        setErrorShowDialog(true);
      });
  };
  const updateMaterial = (e) => {
    e.preventDefault();
    // Converte o preço formatado para número antes de enviar
    const formData = {
      ...form,
      unit_price: parseCurrency(form.unit_price)
    };
    
    updateMaterialApi(editId, formData)
      .then(data => {
        if (data.success) {
          setSuccessMsg("Material atualizado com sucesso!");
          setshowNewMaterial(false);
          setShowDialog(true);
        } else {
          setErrorMsg(data.message || "Erro ao atualizar material");
          setErrorShowDialog(true);
        }
      })
      .catch(error => {
        setErrorMsg("Erro ao atualizar material");
        setErrorShowDialog(true);
      });
  };

  const handleSubmit = isEdit ? updateMaterial : addMaterial;

  const handleDialogOk = () => {
    setShowDialog(false);
    navigate('/materiais');
  };

  const handleDialogCancel = () => {
    setShowDialog(false); 
    setErrorShowDialog(false);
  };

  const handleDialogNovo = () => {
    setShowDialog(false);
    setForm({
      name: '',
      description: '',
      unit: '',
      unit_price: '',
      stock_quantity: '',
      minimum_stock: '',
      category: ''
    });
  };
  return (
    <div className="app-container">
      <button
        type="button"
        className="btn btn-light position-absolute app-btn"
        style={{ top: 20, left: 20, zIndex: 10, boxShadow: '0 1px 4px #ccc', borderRadius: '50%', padding: '0.4rem 0.7rem' }}
        onClick={() => navigate(-1)}
        aria-label="Voltar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M15.5 19l-7-7 7-7" stroke="#333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <h2 className='app-title'>{isEdit ? 'Editar Material' : 'Cadastro de Material'}</h2>
      <form onSubmit={handleSubmit} className="app-form">
        <div className="row gy-2 flex-column">
          <div className="col-12">
            <label className="form-label mb-1" style={{ fontSize: '0.97rem' }}>Nome *</label>
            <input
              type="text"
              className="form-control form-control-sm"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ fontSize: '0.97rem' }}
            />
          </div>
          <div className="col-12">
            <label className="form-label mb-1" style={{ fontSize: '0.97rem' }}>Descrição</label>
            <textarea
              className="form-control form-control-sm"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              style={{ fontSize: '0.97rem' }}
            />
          </div>
          <div className="col-12">
            <label className="form-label mb-1" style={{ fontSize: '0.97rem' }}>Unidade *</label>
            <select
              className="form-control form-control-sm"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              required
              style={{ fontSize: '0.97rem' }}
            >
              <option value="">Selecione...</option>
              <option value="UN">Unidade</option>
              <option value="PC">Peça</option>
              <option value="M">Metro</option>
              <option value="M2">Metro Quadrado</option>
              <option value="M3">Metro Cúbico</option>
              <option value="KG">Quilograma</option>
              <option value="L">Litro</option>
              <option value="CX">Caixa</option>
              <option value="PAC">Pacote</option>
            </select>
          </div>          <div className="col-12">
            <label className="form-label mb-1" style={{ fontSize: '0.97rem' }}>Preço Unitário *</label>
            <input
              type="text"
              className="form-control form-control-sm"
              name="unit_price"
              value={form.unit_price}
              onChange={handleChange}
              placeholder="R$ 0,00"
              required
              style={{ fontSize: '0.97rem' }}
            />
          </div>
          <div className="col-12">
            <label className="form-label mb-1" style={{ fontSize: '0.97rem' }}>Categoria *</label>
            <input
              type="text"
              className="form-control form-control-sm"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              style={{ fontSize: '0.97rem' }}
            />
          </div>
          <div className="col-12">
            <label className="form-label mb-1" style={{ fontSize: '0.97rem' }}>Quantidade em Estoque *</label>
            <input
              type="number"
              step="0.01"
              className="form-control form-control-sm"
              name="stock_quantity"
              value={form.stock_quantity}
              onChange={handleChange}
              required
              style={{ fontSize: '0.97rem' }}
            />
          </div>
          <div className="col-12">
            <label className="form-label mb-1" style={{ fontSize: '0.97rem' }}>Estoque Mínimo *</label>
            <input
              type="number"
              step="0.01"
              className="form-control form-control-sm"
              name="minimum_stock"
              value={form.minimum_stock}
              onChange={handleChange}
              required
              style={{ fontSize: '0.97rem' }}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3 app-btn">
          {isEdit ? 'Atualizar Material' : 'Cadastrar Material'}
        </button>
      </form>
      
      <ModalDialog
        show={showDialog}
        title={successMsg}
        onOk={showNewMaterial ? handleDialogNovo : handleDialogOk}
        okText={showNewMaterial ? 'Cadastrar novo material' : 'Ok'}
        onCancel={showNewMaterial ? handleDialogOk : undefined}
        cancelText={showNewMaterial ? 'Voltar à lista' : undefined}
      />

      <ModalDialog
        show={showErrorDialog}
        title={errorMsg}
        onOk={handleDialogCancel}
        okText="Ok"
      />
    </div>
  );
}

export default MaterialRegister;
