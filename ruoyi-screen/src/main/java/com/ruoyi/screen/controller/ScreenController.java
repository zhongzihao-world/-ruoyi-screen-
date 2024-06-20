package com.ruoyi.screen.controller;

import java.util.List;

import com.ruoyi.screen.domain.SysScreen;
import com.ruoyi.screen.service.IScreenService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.SecurityUtils;

@RestController
@RequestMapping("/screen")
public class ScreenController extends BaseController {
    @Autowired
    private IScreenService screenService;


    @GetMapping("/list")
    public TableDataInfo list(SysScreen sysScreen) {
        startPage();
        List<SysScreen> list = screenService.selectScreenList(sysScreen);
        return getDataTable(list);
    }

    @Log(title = "大屏任务", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody SysScreen sysScreen) {
        Long id = screenService.insertScreen(sysScreen);
        return AjaxResult.success(id);
    }

    @Log(title = "大屏任务", businessType = BusinessType.DELETE)
    @DeleteMapping("/{screenIds}")
    public AjaxResult remove(@PathVariable Long[] screenIds) {
        return toAjax(screenService.deleteScreenByScreenIds(screenIds));
    }

    @GetMapping(value = "/{screenId}")
    public AjaxResult getInfo(@PathVariable("screenId") Long screenId) {
        return AjaxResult.success(screenService.selectScreenByScreenId(screenId));
    }

    @Log(title = "大屏任务", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody SysScreen sysScreen) {
        SysScreen sysScreen1 = null;
        try {
            sysScreen1 = screenService.selectScreenByScreenId(sysScreen.getScreenId());
            if (!("" + sysScreen1.getCreateBy()).equals("" + SecurityUtils.getUserId())) {
                throw new ServiceException("非所属用户,无法修改");
            }
        } catch (ServiceException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ServiceException("非所属用户无法修改");
        }

        return toAjax(screenService.updateScreen(sysScreen));
    }
}
