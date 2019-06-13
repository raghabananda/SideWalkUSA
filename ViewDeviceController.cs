using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SidewalksPlusUSA_CONT.Data;
using SidewalksPlusUSA_CONT.Data.Models;

namespace SidewalksPlusUSA_CONT.Web.Controllers
{
    public class ViewDeviceController : Controller
    {
        private readonly SidewalksPlusUSACONTContext _context;
        public ViewDeviceController(SidewalksPlusUSACONTContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            return View();
        }
        
        public IQueryable<dynamic> GetDeviceDetails()
        {         
            
            return from device in _context.DeviceDetails
                   join client in _context.Users on device.ClientId.ToString() equals client.UserId
                   join worker in _context.Users on device.WorkerId.ToString() equals worker.UserId
                   join myclient in _context.ClientDetails on device.ClientId.ToString() equals myclient.UserId into ps
                   from myclient in ps.DefaultIfEmpty()
                   select new
                   {
                       Id = device.Id,
                       DeviceID= device.DeviceId,
                       DeviceName = device.DeviceName,
                       ClientName = client.FirstName+' '+client.LastName,
                       WorkerName=  worker.FirstName+' '+worker.LastName,
                       SerialNo= device.SerialNumber,
                       LastUsedBy= device.LastUsedBy,
                       MaximumDevieces= myclient.MaximumDevices,
                       Describtion= device.Description,
                       Status = device.Status
                   };

            //var client = (from clients in _context.Users where clients.RoleId == 2 select clients).ToList();
            //var worker = (from workers in _context.Users where workers.RoleId == 3 select workers).ToList();
        }

        public IQueryable<dynamic> GetSuperAdminClientAndWorkers()
        {
            return from users in _context.Users where users.RoleId==1 || users.RoleId==2 ||users.RoleId==3 select users;
        }


        public IActionResult DeleteDeviceDetailsRecord(int iD)
        {
            try
            {
                var devicedetails = _context.DeviceDetails.FirstOrDefault<DeviceDetails>(d => d.Id == iD);
                if (devicedetails != null)
                {
                    _context.DeviceDetails.Remove(devicedetails);
                    _context.SaveChanges();
                    return new OkObjectResult("Record deleted successfully!");
                }
                else
                    return new OkObjectResult("Record with this ID is not found");
                //return new OkObjectResult("Record with this ID is inside controller"+ " "+iD.ToString());
            }
            catch(Exception ex)
            {
                return new ObjectResult("Record is not deleted.Som3ething goes wrong.");
            }
           
        }

        [HttpPost]
        public IActionResult UpdateDeviceDetails([FromBody]DeviceDetails obj)
        {
           //update logic
           //
            return new ObjectResult("Record modified successfully!");
        }

       
    }
}