using dNET.API.Attributes;
using dNET.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using PortalOS.Domain.Entities;
using PortalOS.Domain.Services;
using PortalOS.Domain.ViewModels;

namespace PortalOS.API.Controllers
{
    public class ClienteController : ApiControllerQuery<Cliente>
    {
        private readonly ClienteService _clienteService;

        public ClienteController(ClienteService clienteService) : base(clienteService)
        {
            _clienteService = clienteService;
        }

        [RequirePermission("clientes.read")]
        [GetEndpoint]
        public IActionResult GetAll(ODataQueryOptions<Cliente> queryOptions)
        {
            return OData(queryOptions);
        }

        [RequirePermission("clientes.read")]
        [GetEndpoint("{id}")]
        public IActionResult GetById(long id)
        {
            var cliente = _clienteService.GetById(id);
            if (cliente == null)
            {
                return Http404("Cliente nao encontrado");
            }
            return Http200(ClienteResponse.FromEntity(cliente));
        }

        [RequirePermission("clientes.read")]
        [GetEndpoint("ativos")]
        public IActionResult GetAtivos()
        {
            var clientes = _clienteService.GetAtivos();
            return Http200(clientes.Select(ClienteResponse.FromEntity));
        }

        [RequirePermission("clientes.create")]
        [PostEndpoint]
        public IActionResult Create([FromBody] CreateClienteRequest request)
        {
            return TryExecute(request, () =>
            {
                var cliente = _clienteService.Create(request);
                return Http201(ClienteResponse.FromEntity(cliente));
            });
        }

        [RequirePermission("clientes.update")]
        [PutEndpoint("{id}")]
        public IActionResult Update(long id, [FromBody] UpdateClienteRequest request)
        {
            return TryExecute(request, () =>
            {
                var cliente = _clienteService.Update(id, request);
                return Http200(ClienteResponse.FromEntity(cliente));
            });
        }

        [RequirePermission("clientes.delete")]
        [DeleteEndpoint("{id}")]
        public IActionResult Delete(long id)
        {
            return TryExecute(id, () =>
            {
                var cliente = _clienteService.Delete(id);
                if (cliente == null)
                {
                    return Http404("Cliente nao encontrado");
                }
                return Http200(new { message = "Cliente deletado com sucesso" });
            });
        }
    }
}
